# Generated by Django 5.1.1 on 2024-09-17 04:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_saleorder_customer_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='saleorder',
            name='invoice_pdf',
            field=models.FileField(blank=True, null=True, upload_to='invoices/'),
        ),
    ]
