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
        item_id = request.data.get('item_id')
        request.data['user'] = request.user.id

        if item_id:
            # Update existing item
            item = get_object_or_404(Item, item_id=item_id, user=request.user)
            serializer = ItemSerializer(item, data=request.data, partial=True)
        else:
            # Create new item
            serializer = ItemSerializer(data=request.data)

        if serializer.is_valid():
            item = serializer.save()
            return Response(ItemSerializer(item).data, status=status.HTTP_200_OK if item_id else status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)