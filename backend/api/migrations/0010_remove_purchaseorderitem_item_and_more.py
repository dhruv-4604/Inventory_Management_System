# Generated by Django 4.0.1 on 2024-09-14 16:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_purchaseorder_purchaseorderitem'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='purchaseorderitem',
            name='item',
        ),
        migrations.RemoveField(
            model_name='purchaseorderitem',
            name='purchase_order',
        ),
        migrations.DeleteModel(
            name='PurchaseOrder',
        ),
        migrations.DeleteModel(
            name='PurchaseOrderItem',
        ),
    ]
