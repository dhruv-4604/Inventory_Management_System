from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Category, Item,Customer,Vendor,SaleOrder, SaleOrderItem,PurchaseOrder,PurchaseOrderItem, Shipment, Company

User = get_user_model()

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['company_name', 'gst_number', 'address', 'city', 'state', 'pincode', 'bank_name', 'bank_account_number', 'ifsc_code', 'company_logo']  # Updated fields
     

class CustomUserSerializer(serializers.ModelSerializer):
    company = CompanySerializer(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone_number', 'password', 'company']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        company_data = validated_data.pop('company', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            phone_number=validated_data['phone_number']
        )
        if company_data:
            Company.objects.create(user=user, **company_data)
        return user

    def update(self, instance, validated_data):
        company_data = validated_data.pop('company', None)
        instance = super().update(instance, validated_data)
        if company_data:
            Company.objects.update_or_create(user=instance, defaults=company_data)
        return instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['name'] = user.name
        return token



class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['item_id', 'name', 'brand', 'image', 'category', 'description', 'selling_price', 'purchase_price', 'user', 'quantity', 'reorder_point']
        read_only_fields = ['item_id']




class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['customer_id', 'name', 'email', 'phone_number', 'address', 'state', 'city', 'pincode', 'user']
        read_only_fields = ['customer_id']

    def create(self, validated_data):
        return Customer.objects.create(**validated_data)



class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['vendor_id', 'name', 'email', 'phone_number', 'user','address']
        read_only_fields = ['vendor_id']

    def create(self, validated_data):
        return Vendor.objects.create(**validated_data)



class SaleOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleOrderItem
        fields = ['item_id', 'quantity', 'rate', 'user']

class SaleOrderSerializer(serializers.ModelSerializer):
    items = SaleOrderItemSerializer(many=True)

    class Meta:
        model = SaleOrder
        fields = ['sale_order_id', 'date', 'customer_id', 'customer_name', 'customer_email',
                  'customer_address', 'customer_state', 'customer_city', 'customer_pincode',
                  'mode_of_delivery', 'carrier', 'payment_received', 'items', 'discount',
                  'total_amount', 'invoice_pdf', 'user']
        read_only_fields = ['sale_order_id', 'date', 'invoice_pdf']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        sale_order = SaleOrder.objects.create(**validated_data)
        for item_data in items_data:
            item_data['user'] = validated_data['user']
            SaleOrderItem.objects.create(sale_order=sale_order, **item_data)
        return sale_order



class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ['item_id', 'quantity', 'rate', 'user']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True)

    class Meta:
        model = PurchaseOrder
        fields = ['purchase_order_id', 'date', 'vendor_id', 'vendor_name', 'vendor_address', 'payment_status', 'items', 'total_amount', 'user']
        read_only_fields = ['purchase_order_id', 'date']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        purchase_order = PurchaseOrder.objects.create(**validated_data)
        for item_data in items_data:
            item_data['user'] = validated_data['user']
            PurchaseOrderItem.objects.create(purchase_order=purchase_order, **item_data)
        return purchase_order



class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ['shipment_id', 'date', 'order_id', 'customer_name', 'carrier', 'tracking_id', 'status', 'user']
        read_only_fields = ['shipment_id', 'date', 'tracking_id']



   
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'image', 'user']
        read_only_fields = ['id']