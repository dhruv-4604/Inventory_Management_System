from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsAPIView(generics.GenericAPIView):
     def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class CustomTokenRefreshView(TokenRefreshView):
    # If you need custom behavior for token refresh, override methods here
    pass


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Item
from .serializers import ItemSerializer

class ItemListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Item.objects.filter(user=request.user)
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id

        serializer = ItemSerializer(data=mutable_data)
        if serializer.is_valid():
            item = serializer.save()
            return Response(ItemSerializer(item).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        mutable_data = request.data.copy()
        item_id = mutable_data.get('item_id')
        
        if not item_id:
            return Response({"error": "item_id is required for updating an item"}, status=status.HTTP_400_BAD_REQUEST)

        item = get_object_or_404(Item, item_id=item_id, user=request.user)
        mutable_data['user'] = request.user.id

        serializer = ItemSerializer(item, data=mutable_data, partial=True)
        if serializer.is_valid():
            updated_item = serializer.save()
            return Response(ItemSerializer(updated_item).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        item = get_object_or_404(Item, item_id=item_id, user=request.user)
        item.delete()
        return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Customer
from .serializers import CustomerSerializer

class CustomerListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request):
        customer_id = request.data.get('customer_id')
        request.data['user'] = request.user.id
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .models import Vendor
from .serializers import VendorSerializer

class VendorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vendors = Vendor.objects.filter(user=request.user)
        serializer = VendorSerializer(vendors, many=True)
        return Response(serializer.data)

    def post(self, request):
       vendor_id = request.data.get('vendor_id')
       request.data['user'] = request.user.id
       serializer = VendorSerializer(data=request.data)
       if serializer.is_valid():
           serializer.save()
           return Response(serializer.data, status=status.HTTP_201_CREATED)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import SaleOrder, Item
from .serializers import SaleOrderSerializer

class SaleOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Add user to the data
        data = request.data.copy()
        data['user'] = request.user.id
        data['payment_received'] = data.pop('payment', False)  # Rename 'payment' to 'payment_received'

        serializer = SaleOrderSerializer(data=data)
        if serializer.is_valid():
            # Create the sale order
            sale_order = serializer.save()

            # Update item quantities
            for item_data in data['items']:
                item = Item.objects.get(item_id=item_data['item_id'])
                if item.quantity >= item_data['quantity']:
                    item.quantity -= item_data['quantity']
                    item.save()
                else:
                    # If there's not enough stock, delete the created sale order and return an error
                    sale_order.delete()
                    return Response({"error": f"Not enough stock for item {item.name}"}, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        sale_orders = SaleOrder.objects.filter(user=request.user)
        serializer = SaleOrderSerializer(sale_orders, many=True)
        return Response(serializer.data)

    def put(self, request, sale_order_id):
        sale_order = get_object_or_404(SaleOrder, sale_order_id=sale_order_id, user=request.user)
        data = request.data.copy()
        
        # Update only the payment_received field
        sale_order.payment_received = data.get('payment_received', sale_order.payment_received)
        sale_order.save()

        serializer = SaleOrderSerializer(sale_order)
        return Response(serializer.data, status=status.HTTP_200_OK)


from .models import PurchaseOrder, Item
from .serializers import PurchaseOrderSerializer

class PurchaseOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Add user to the data
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = PurchaseOrderSerializer(data=data)
        if serializer.is_valid():
            # Create the purchase order
            purchase_order = serializer.save()

            # Update item quantities
            for item_data in data['items']:
                item = Item.objects.get(item_id=item_data['item_id'])
                item.quantity += item_data['quantity']
                item.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        purchase_orders = PurchaseOrder.objects.filter(user=request.user)
        serializer = PurchaseOrderSerializer(purchase_orders, many=True)
        return Response(serializer.data)

    def put(self, request, purchase_order_id):
        purchase_order = get_object_or_404(PurchaseOrder, purchase_order_id=purchase_order_id, user=request.user)
        data = request.data.copy()
        
        # Update only the payment_status field
        purchase_order.payment_status = data.get('payment_status', purchase_order.payment_status)
        purchase_order.save()

        serializer = PurchaseOrderSerializer(purchase_order)
        return Response(serializer.data, status=status.HTTP_200_OK)