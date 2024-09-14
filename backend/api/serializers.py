from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Item,Customer,Vendor

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
        fields = ['vendor_id', 'name', 'email', 'phone_number', 'user']
        read_only_fields = ['vendor_id']

    def create(self, validated_data):
        return Vendor.objects.create(**validated_data)


