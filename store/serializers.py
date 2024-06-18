from rest_framework import serializers
from .models import Category, Region, Product, Cart

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True) 
    class Meta:
        model = Cart
        fields = '__all__'

# class CartItemSerializer(serializers.ModelSerializer):
#     product = ProductSerializer(read_only=True)  # Nest product details

#     class Meta:
#         model = CartItem
#         fields = ['id', 'product', 'quantity']