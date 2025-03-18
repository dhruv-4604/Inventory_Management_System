from django.urls import path
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from api.views import (
    CategoryView, DashboardView, DeleteItemView, CustomerListView, ItemListView, RegisterView,
    CustomTokenObtainPairView, CustomTokenRefreshView, SaleOrderView, ShipmentListView,
    UserDetailsAPIView, VendorListView, PurchaseOrderView, CompanyDetailsView
)

def home_view(request):
    return JsonResponse({"message": "Welcome to SupplySync API!"})

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/user/', UserDetailsAPIView.as_view(), name='user_details'),
    path('token/items/', ItemListView.as_view(), name='items'),
    path('token/items/delete/<str:item_id>/', DeleteItemView.as_view(), name='delete_item'),
    path('customers/', CustomerListView.as_view(), name='customer-list'),
    path('token/vendors/', VendorListView.as_view(), name='vendors'),
    path('token/saleorders/', SaleOrderView.as_view(), name='sale-orders'),
    path('token/saleorders/<str:sale_order_id>/', SaleOrderView.as_view(), name='update-sale-order'),
    path('token/purchaseorders/', PurchaseOrderView.as_view(), name='purchase-orders'),
    path('token/purchaseorders/<str:purchase_order_id>/', PurchaseOrderView.as_view(), name='update-purchase-order'),
    path('token/shipments/', ShipmentListView.as_view(), name='shipments'),
    path('token/shipments/<str:shipment_id>/', ShipmentListView.as_view(), name='update-shipment'),
    path('token/categories/', CategoryView.as_view(), name='categories'),
    path('token/categories/<int:category_id>/', CategoryView.as_view(), name='category-detail'),
    path('company/', CompanyDetailsView.as_view(), name='company-details'),
    path('token/dashboard/', DashboardView.as_view(), name='dashboard'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
