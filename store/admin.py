from django.contrib import admin
from .models import Category, Region, Product, Cart

# Register your models here.

admin.site.register(Category)
admin.site.register(Region)
admin.site.register(Product)
admin.site.register(Cart)
