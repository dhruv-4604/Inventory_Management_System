from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import AbstractBaseUser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer, ShipmentSerializer, CompanySerializer


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


from .models import Company, SaleOrderItem
from .serializers import CompanySerializer

class UserDetailsAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer

    def get(self, request):
        user = request.user
        user_serializer = self.get_serializer(user)
        user_data = user_serializer.data

        # Fetch company details
        try:
            company = Company.objects.get(user=user)
            company_serializer = CompanySerializer(company)
            company_data = company_serializer.data
        except Company.DoesNotExist:
            company_data = {
                'company_name': '',
                'gst_number': '',
                'phone_number': user.phone_number,
                'address': '',
                'city': '',
                'state': '',
                'pincode': '',
                'bank_name': '',
                'bank_account_number': '',
                'ifsc_code': '',
            }

        # Combine user and company data
        response_data = {**user_data, **company_data}
        return Response(response_data, status=status.HTTP_200_OK)

    # def put(self, request):
    #     user = request.user
    #     password = request.data.get('password')

    #     if not password:
    #         return Response({"error": "Password is required to save changes."}, status=status.HTTP_400_BAD_REQUEST)

    #     if not user.check_password(password):
    #         return Response({"error": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST)

    #     user_serializer = self.get_serializer(user, data=request.data, partial=True)
        
    #     if user_serializer.is_valid():
    #         user_serializer.save()

    #         # Update or create company details
    #         company_data = {
    #             'company_name': request.data.get('company_name', ''),
    #             'gst_number': request.data.get('gst_number', ''),
    #             'phone_number': request.data.get('phone_number', user.phone_number),
    #             'address': request.data.get('address', ''),
    #             'city': request.data.get('city', ''),
    #             'state': request.data.get('state', ''),
    #             'pincode': request.data.get('pincode', ''),
    #             'bank_name': request.data.get('bank_name', ''),
    #             'bank_account_number': request.data.get('bank_account_number', ''),
    #             'ifsc_code': request.data.get('ifsc_code', ''),
    #         }

    #         company, created = Company.objects.update_or_create(
    #             user=user,
    #             defaults=company_data
    #         )

    #         # Combine user and company data for response
    #         response_data = {**user_serializer.data, **CompanySerializer(company).data}
    #         return Response(response_data, status=status.HTTP_200_OK)
        
    #     return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        customers = Customer.objects.filter(user=request.user)
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request):
        request.data['user'] = request.user.id
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        customer_id = request.data.get('customer_id')
        if not customer_id:
            return Response({"error": "customer_id is required for updating a customer"}, status=status.HTTP_400_BAD_REQUEST)

        customer = get_object_or_404(Customer, customer_id=customer_id, user=request.user)
        serializer = CustomerSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
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
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from django.core.files.base import ContentFile


from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, Spacer
from .models import Company








class SaleOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Add user to the data
        data = request.data.copy()
        data['user'] = request.user.id
        data['payment_received'] = data.pop('payment', False)

        # Fetch customer email if customer_id is provided
        customer_id = data.get('customer_id')
        if customer_id:
            try:
                customer = Customer.objects.get(customer_id=customer_id, user=request.user)
                data['customer_email'] = customer.email
            except Customer.DoesNotExist:
                pass

        # Ensure each item in the items list has the user field set
        for item in data['items']:
            item['user'] = request.user.id

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

            # Generate and save invoice PDF
            self.generate_invoice_pdf(sale_order)

            # Create shipment if mode_of_delivery is 'DELIVERY'
            if data['mode_of_delivery'] == 'DELIVERY':
                shipment_data = {
                    'order_id': sale_order.sale_order_id,
                    'customer_name': sale_order.customer_name,
                    'carrier': sale_order.carrier,
                    'user': request.user.id,  # Add user to shipment data
                }
                shipment_serializer = ShipmentSerializer(data=shipment_data)
                if shipment_serializer.is_valid():
                    shipment_serializer.save()
                else:
                    # If there's an error creating the shipment, log it but don't prevent the sale order from being created
                    print(f"Error creating shipment: {shipment_serializer.errors}")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    


    def generate_invoice_pdf(self, sale_order):
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Set up the PDF
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, height - 50, "Invoice")

        # Add company details
        # company = Company.objects.get(user=sale_order.user)
        # p.setFont("Helvetica", 10)
        # p.drawString(50, height - 80, f"Company: {company.company_name}")
        # p.drawString(50, height - 95, f"GST: {company.gst_number}")
        # p.drawString(50, height - 110, f"Address: {company.address}")
        # p.drawString(50, height - 125, f"{company.city}, {company.state} - {company.pincode}")

        # Add sale order details
        p.setFont("Helvetica-Bold", 12)
        p.drawString(400, height - 80, f"Order ID: {sale_order.sale_order_id}")
        p.drawString(400, height - 95, f"Date: {sale_order.date.strftime('%Y-%m-%d')}")

        # Add customer details
        p.setFont("Helvetica", 10)
        p.drawString(50, height - 155, f"Customer: {sale_order.customer_name}")
        p.drawString(50, height - 170, f"Address: {sale_order.customer_address}")
        p.drawString(50, height - 185, f"{sale_order.customer_city}, {sale_order.customer_state} - {sale_order.customer_pincode}")

        # Create table for order items
        data = [["Item", "Quantity", "Rate", "Total"]]
        for item in sale_order.items.all():
            data.append([
                str(item.item_id),
                str(item.quantity),
                f"₹{item.rate:.2f}",
                f"₹{item.quantity * item.rate:.2f}"
            ])

        table = Table(data, colWidths=[2*inch, 1*inch, 1*inch, 1*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        table.wrapOn(p, width - 100, height)
        table.drawOn(p, 50, height - 400)

        # Add total amount and discount
        p.setFont("Helvetica-Bold", 12)
        p.drawString(350, 150, f"Subtotal: ₹{sale_order.total_amount + sale_order.discount:.2f}")
        p.drawString(350, 135, f"Discount: ₹{sale_order.discount:.2f}")
        p.drawString(350, 120, f"Total Amount: ₹{sale_order.total_amount:.2f}")

        # Add payment status
        p.setFont("Helvetica", 10)
        payment_status = "Paid" if sale_order.payment_received else "Unpaid"
        p.drawString(50, 100, f"Payment Status: {payment_status}")

        # Add delivery information
        p.drawString(50, 85, f"Mode of Delivery: {sale_order.get_mode_of_delivery_display()}")
        if sale_order.mode_of_delivery == 'DELIVERY':
            p.drawString(50, 70, f"Carrier: {sale_order.get_carrier_display()}")

        # Add footer
        p.setFont("Helvetica", 8)
        p.drawString(inch, 0.75 * inch, "Thank you for your business!")

        p.showPage()
        p.save()

        # Save the PDF to the sale_order model
        pdf_file = ContentFile(buffer.getvalue())
        sale_order.invoice_pdf.save(f'invoice_{sale_order.sale_order_id}.pdf', pdf_file)

        # Send email with invoice
        subject = 'Sale Order Invoice'
        message = f'Please find attached the invoice for your order (ID: {sale_order.sale_order_id}).'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [sale_order.customer_email]
        mail = EmailMessage(subject=subject, body=message, from_email=from_email, to=recipient_list)
        mail.attach_file(f"{settings.BASE_DIR}/media/invoices/invoice_{sale_order.sale_order_id}.pdf")
        mail.send()







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

    # def send_invoice_email(self):
       

from .models import PurchaseOrder, Item
from .serializers import PurchaseOrderSerializer

class PurchaseOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Add user to the data
        data = request.data.copy()
        data['user'] = request.user.id

        # Ensure each item in the items list has the user field set
        for item in data['items']:
            item['user'] = request.user.id

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

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Shipment
from .serializers import ShipmentSerializer

class ShipmentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch all shipments
        shipments = Shipment.objects.all()
        serializer = ShipmentSerializer(shipments, many=True)
        return Response(serializer.data)

    def put(self, request, shipment_id):
        # Update shipment status
        shipment = get_object_or_404(Shipment, shipment_id=shipment_id)
        data = request.data.copy()
        
        # Update only the status field
        shipment.status = data.get('status', shipment.status)
        shipment.save()

        serializer = ShipmentSerializer(shipment)
        return Response(serializer.data, status=status.HTTP_200_OK)


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Category, Item
from .serializers import CategorySerializer

class CategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = CategorySerializer(data=data)
        if serializer.is_valid():
            category = serializer.save()
            
            # Get the list of item IDs from the request data
            item_ids = request.data.get('item_ids', [])
            if item_ids:
                Item.objects.filter(item_id__in=item_ids, user=request.user).update(category=category)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, category_id):
        category = get_object_or_404(Category, id=category_id, user=request.user)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, category_id):
        category = get_object_or_404(Category, id=category_id, user=request.user)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
