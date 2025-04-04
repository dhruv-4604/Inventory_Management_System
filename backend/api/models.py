from datetime import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import MinValueValidator
import random
import string
from django.core.validators import MinLengthValidator
from django.utils import timezone

def generate_tracking_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=11))

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Field required for superuser
    is_superuser = models.BooleanField(default=False)  # Field required for superuser
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to='category_images/', null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='categories')

    def __str__(self):
        return self.name

class Item(models.Model):
    created_at = models.DateTimeField(auto_now=True)
    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255, default='None')
    image = models.ImageField(upload_to='item_images/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField()
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='items')
    quantity = models.IntegerField(validators=[MinValueValidator(0)], default=1)
    reorder_point = models.IntegerField(validators=[MinValueValidator(0)], default=0)

    def __str__(self):
        return self.name




class Customer(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    customer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    state = models.CharField(max_length=100)  # New field
    city = models.CharField(max_length=100)   # New field
    pincode = models.CharField(max_length=6)  # New field
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='customers')

    def __str__(self):
        return self.name

class Vendor(models.Model):
    vendor_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    address = models.TextField(default='None')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='vendors')

    def __str__(self):
        return self.name

class SaleOrder(models.Model):
    DELIVERY_CHOICES = [
        ('PICKUP', 'Pickup'),
        ('DELIVERY', 'Delivery'),
    ]

    CARRIER_CHOICES = [
        ('FEDEX', 'FedEx'),
        ('UPS', 'UPS'),
        ('USPS', 'USPS'),
        ('DHL', 'DHL'),
        ('OTHER', 'Other'),
    ]

    sale_order_id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    customer_id = models.IntegerField(default=0)
    customer_name = models.CharField(max_length=255, default='None')
    customer_address = models.TextField(default='None')
    mode_of_delivery = models.CharField(max_length=10, choices=DELIVERY_CHOICES)
    carrier = models.CharField(max_length=10, choices=CARRIER_CHOICES)
    payment_received = models.BooleanField(default=False)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='sale_orders')
    customer_state = models.CharField(max_length=100, default='None')
    customer_city = models.CharField(max_length=100, default='None')
    customer_pincode = models.CharField(max_length=6, default='None')
    customer_email = models.EmailField(max_length=255, default='', blank=True)
    invoice_pdf = models.FileField(upload_to='invoices/', null=True, blank=True)

    def __str__(self):
        return f"Sale Order {self.sale_order_id} - {self.customer_name}"

class SaleOrderItem(models.Model):
    sale_order = models.ForeignKey(SaleOrder, on_delete=models.CASCADE, related_name='items')
    item_id = models.IntegerField(default=0)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    rate = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='sale_order_items')

    def __str__(self):
        return f"{self.quantity} x Item {self.item_id} for Sale Order {self.sale_order.sale_order_id}"

class PurchaseOrder(models.Model):
    PAYMENT_CHOICES = [
        ('UNPAID', 'Unpaid'),
        ('PAID', 'Paid'),
    ]

    purchase_order_id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    vendor_id = models.IntegerField(default=0)
    vendor_name = models.CharField(max_length=255, default='None')
    vendor_address = models.TextField(default='None')
    payment_status = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='UNPAID')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='purchase_orders')

    def __str__(self):
        return f"Purchase Order {self.purchase_order_id} - {self.vendor_name}"

class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    item_id = models.IntegerField()
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    rate = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='purchase_order_items')

    def __str__(self):
        return f"{self.quantity} x Item {self.item_id} for Purchase Order {self.purchase_order.purchase_order_id}"

class Shipment(models.Model):
    STATUS_CHOICES = [
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered'),
        ('RETURNED', 'Returned'),
    ]

    shipment_id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    order_id = models.IntegerField()
    customer_name = models.CharField(max_length=255)
    carrier = models.CharField(max_length=50)
    tracking_id = models.CharField(max_length=11, unique=True, default=generate_tracking_id, validators=[MinLengthValidator(11)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='IN_TRANSIT')
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='shipments')

    def __str__(self):
        return f"Shipment {self.shipment_id} for Order {self.order_id}"

class Company(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='company')
    company_name = models.CharField(max_length=255,default="My Company")
    gst_number = models.CharField(max_length=15, blank=True, null=True,default="VAT0000")
    address = models.TextField(blank=True, null=True,default=" ")
    city = models.CharField(max_length=100, blank=True, null=True,default=" ")
    state = models.CharField(max_length=100, blank=True, null=True,default=" ")
    pincode = models.CharField(max_length=10, blank=True, null=True,default=" ")
    bank_name = models.CharField(max_length=100, blank=True, null=True,default="My Bank")
    bank_account_number = models.CharField(max_length=20, blank=True, null=True,default="124567890")
    ifsc_code = models.CharField(max_length=11, blank=True, null=True,default=" ")
    company_logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)  # New field

    def __str__(self):
        return self.company_name

