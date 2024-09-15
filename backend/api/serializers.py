from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Item,Customer,Vendor,SaleOrder, SaleOrderItem,PurchaseOrder,PurchaseOrderItem

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'company_name', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            company_name=validated_data['company_name'],
            phone_number=validated_data['phone_number']
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['company_name'] = user.company_name
        return token



class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['item_id', 'name', 'brand', 'image', 'category', 'description', 'selling_price', 'purchase_price', 'user','quantity','reorder_point']
        read_only_fields = ['item_id']

    def create(self, validated_data):
        return Item.objects.create(**validated_data)
    
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['customer_id', 'name', 'email', 'phone_number', 'address', 'user']
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
        fields = ['item_id', 'quantity', 'rate']

class SaleOrderSerializer(serializers.ModelSerializer):
    items = SaleOrderItemSerializer(many=True)

    class Meta:
        model = SaleOrder
        fields = ['sale_order_id', 'date', 'customer_id', 'customer_name', 'customer_address', 'mode_of_delivery', 'carrier', 'payment_received', 'items', 'discount', 'total_amount', 'user']
        read_only_fields = ['sale_order_id', 'date']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        sale_order = SaleOrder.objects.create(**validated_data)
        for item_data in items_data:
            SaleOrderItem.objects.create(sale_order=sale_order, **item_data)
        return sale_order



class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ['item_id', 'quantity', 'rate']

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
            PurchaseOrderItem.objects.create(purchase_order=purchase_order, **item_data)
        return purchase_order


