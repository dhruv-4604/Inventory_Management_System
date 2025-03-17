from django.contrib.auth import get_user_model, authenticate
from django.core.files.base import ContentFile
from django.core.mail import EmailMessage
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, Spacer
from num2words import num2words
from .models import (
    Company, SaleOrderItem, Item, Customer, Vendor, SaleOrder, 
    PurchaseOrder, Shipment, Category
)
from .serializers import (
    CustomUserSerializer, CustomTokenObtainPairSerializer, ShipmentSerializer, 
    CompanySerializer, ItemSerializer, CustomerSerializer, VendorSerializer, 
    SaleOrderSerializer, PurchaseOrderSerializer, CategorySerializer
)

User = get_user_model()

class CompanyDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            company = Company.objects.get(user=request.user)
            serializer = CompanySerializer(company)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response({"error": "Company details not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        password = request.data.get('password')
        if not password:
            return Response({"error": "Password is required for verification"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=request.user.username, password=password)
        if user is None:
            return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            company = Company.objects.get(user=request.user)
            serializer = CompanySerializer(company, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Company.DoesNotExist:
            serializer = CompanySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
                'company_logo': None,  # Default value for company_logo
            }

        # Combine user and company data
        response_data = {**user_data, **company_data}
        return Response(response_data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        password = request.data.get('password')

        # Authenticate the user
        if not authenticate(username=user.email, password=password):
            return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)

        # Update user details
        serializer = self.get_serializer(user, data={
            'name': request.data.get('name'),
            'phone_number': request.data.get('phone_number')
        }, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    pass

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
        company = Company.objects.get(user=sale_order.user)
        
        # Logo placement on the right side
        logo_width = 100  # Adjust as needed
        logo_height = 60  # Adjust as needed
        if company.company_logo:
            logo_path = company.company_logo.path
            p.drawImage(logo_path, width - logo_width - 50, height - 110, width=logo_width, height=logo_height)

        # Start company details on the left side, shifted upwards
        y_position = height - 60  # Adjusted from height - 100 to height - 80

        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, y_position, company.company_name)
        y_position -= 25  # Move down for next line

        # Add company details
        p.setFont("Helvetica", 10)
        
        # Split address into two lines if it's too long
        address = company.address
        if len(address) > 40:  # Adjust this value based on your needs
            split_index = address.rfind(' ', 0, 40)
            address_line1 = address[:split_index]
            address_line2 = address[split_index+1:]
            p.drawString(50, y_position, address_line1)
            y_position -= 15
            p.drawString(50, y_position, address_line2)
            y_position -= 15
        else:
            p.drawString(50, y_position, address)
            y_position -= 15

        p.drawString(50, y_position, f"GSTIN/UIN: {company.gst_number}")
        y_position -= 15
        p.drawString(50, y_position, f"State Name: {company.state}, Code: {company.pincode}")
        y_position -= 15
        p.drawString(50, y_position, f"Contact: {sale_order.user.phone_number}")
        y_position -= 15
        p.drawString(50, y_position, f"E-Mail: {sale_order.user.email}")

        # Add customer details
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height - 210, "Dispatch To")
        
        p.setFont("Helvetica", 10)
        p.drawString(50, height - 225, f"{sale_order.customer_name}")
        p.drawString(50, height - 240, f"{sale_order.customer_address}")
        p.drawString(50, height - 255, f"{sale_order.customer_city}, {sale_order.customer_state} - {sale_order.customer_pincode}")
        p.drawString(50, height - 270, f"GSTIN/UIN: {company.gst_number}")
        p.drawString(50, height - 285, f"State Name: {sale_order.customer_state}, Code: 29")

        # Create table for order items
        data = [["SI No", "Item Name", "Due on", "Quantity", "Rate", "per", "Amount"]]
        for index, sale_order_item in enumerate(sale_order.items.all(), start=1):
            # Fetch the item from the Item model
            item = get_object_or_404(Item, item_id=sale_order_item.item_id)
            data.append([
                str(index),
                item.name,  # Use the name from the Item model
                "3 Days",
                str(sale_order_item.quantity),
                f"{sale_order_item.rate:.2f}",
                "Nos",
                f"{sale_order_item.quantity * sale_order_item.rate:.2f}"
            ])

        table = Table(data, colWidths=[0.5*inch, 2*inch, 1*inch, 0.8*inch, 0.8*inch, 0.8*inch, 1*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        table.wrapOn(p, width - 100, height)
        table.drawOn(p, 50, height - 500)

        # Add total amount and taxes
        p.setFont("Helvetica-Bold", 10)
        p.drawString(410, height - 520, f"Subtotal: INR {sale_order.total_amount}")
        p.drawString(410, height - 535, f"Central Tax: INR {sale_order.total_amount }")
        p.drawString(410, height - 550, f"State Tax: INR {sale_order.total_amount }")
        p.drawString(410, height - 565, f"Total: INR {sale_order.total_amount }")

        # Add amount in words
        p.setFont("Helvetica", 10)
        p.drawString(50, height - 580, f"Amount Chargeable (in words)")
        p.drawString(50, height - 595, f"INR {num2words(int(sale_order.total_amount )).title()} Only")

        # Add company's bank details
        p.setFont("Helvetica-Bold", 10)
        p.drawString(50, height - 640, "Company's Bank Details")
        p.setFont("Helvetica", 10)
        p.drawString(50, height - 655, f"Bank Name: {company.bank_name}")
        p.drawString(50, height - 670, f"A/c No.: {company.bank_account_number}")
        p.drawString(50, height - 685, f"Branch & IFS Code: {company.ifsc_code}")

        # Add footer
        p.setFont("Helvetica", 8)
        p.drawString(inch, 0.75 * inch, "This is a Computer Generated Document. No Signature Required.")

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

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, F
from django.utils import timezone
from .models import SaleOrder, Item, Customer, Vendor, Shipment, SaleOrderItem
from .serializers import SaleOrderSerializer, ItemSerializer, CustomerSerializer, VendorSerializer, ShipmentSerializer


from django.db.models import Sum, F, OuterRef, Subquery
from .models import SaleOrder, Item, Customer, Vendor, Shipment, SaleOrderItem

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Fetch total revenue
        total_revenue = SaleOrder.objects.filter(user=user).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

        # Fetch pending shipments
        pending_shipments = Shipment.objects.filter(user=user, status='IN_TRANSIT').count()

        # Fetch new customers
        current_month = timezone.now().month
        current_year = timezone.now().year
        new_customers = Customer.objects.filter(
            user=user,
            created_at__month=current_month,
            created_at__year=current_year
        ).count()

        # Fetch total order count
        total_orders = SaleOrder.objects.filter(user=user).count()

        # Fetch top selling products
        top_selling_items = SaleOrderItem.objects.filter(sale_order__user=user)\
            .values('item_id')\
            .annotate(total_quantity=Sum('quantity'))\
            .order_by('-total_quantity')[:5]

        # Get the corresponding Item objects
        item_ids = [item['item_id'] for item in top_selling_items]
        top_items = Item.objects.filter(item_id__in=item_ids)

        # Create a dictionary to map item_id to total_quantity
        quantity_map = {item['item_id']: item['total_quantity'] for item in top_selling_items}

        # Process top selling products
        top_selling_products_list = []
        for item in top_items:
            product_data = {
                'item_id': item.item_id,
                'name': item.name,
                'total_quantity': quantity_map[item.item_id],
                'image': None
            }
            if item.image:
                product_data['image'] = request.build_absolute_uri(item.image.url)
            top_selling_products_list.append(product_data)

        # Sort the list by total_quantity
        top_selling_products_list.sort(key=lambda x: x['total_quantity'], reverse=True)

        # Fetch stock availability
        total_stock = Item.objects.filter(user=user).aggregate(Sum('quantity'))['quantity__sum'] or 0
        low_stock_items = Item.objects.filter(user=user, quantity__lte=F('reorder_point'))
        out_of_stock_items = Item.objects.filter(user=user, quantity=0)

        # Calculate percentages
        low_stock_count = low_stock_items.count()
        out_of_stock_count = out_of_stock_items.count()
        available_count = Item.objects.filter(user=user).count() - low_stock_count - out_of_stock_count

        total_items = available_count + low_stock_count + out_of_stock_count
        available_percentage = (available_count / total_items) * 100 if total_items > 0 else 0
        low_stock_percentage = (low_stock_count / total_items) * 100 if total_items > 0 else 0
        out_of_stock_percentage = (out_of_stock_count / total_items) * 100 if total_items > 0 else 0

        response_data = {
            'total_revenue': total_revenue,
            'pending_shipments': pending_shipments,
            'new_customers': new_customers,
            'total_orders': total_orders,
            'top_selling_products': top_selling_products_list,
            'total_stock': total_stock,
            'low_stock_items': ItemSerializer(low_stock_items, many=True).data,
            'stock_percentages': {
                'available': round(available_percentage, 2),
                'low_stock': round(low_stock_percentage, 2),
                'out_of_stock': round(out_of_stock_percentage, 2),
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)