# from django.shortcuts import render
# from rest_framework import generics, status
# from rest_framework.response import Response
# from .models import Category, Region, Product, Cart
# from .serializers import CategorySerializer, RegionSerializer, ProductSerializer, CartSerializer


# # Create your views here.

# class ProductList(generics.ListCreateAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

#     def get_queryset(self):
#         queryset = Product.objects.all()
#         category_id = self.request.query_params.get('category_id', None)
#         region_id = self.request.query_params.get('region_id', None)
#         min_price = self.request.query_params.get('min_price', None)
#         max_price = self.request.query_params.get('max_price', None)

#         if category_id is not None:
#             queryset = queryset.filter(category_id=category_id)
#         if region_id is not None:
#             queryset = queryset.filter(region_id=region_id)
#         if min_price is not None:
#             queryset = queryset.filter(price__gte=min_price)
#         if max_price is not None:
#             queryset = queryset.filter(price__lte=max_price)

#         return queryset

# class ProductDetail(generics.RetrieveAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class CartList(generics.ListCreateAPIView):
#     queryset = Cart.objects.all()
#     serializer_class = CartSerializer

#     def create(self, request, *args, **kwargs):
#         product_id = request.data.get('product_id')
#         quantity = request.data.get('quantity', 1)

#         try:
#             product = Product.objects.get(id=product_id)
#         except Product.DoesNotExist:
#             return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

#         if product.stock_quantity < int(quantity):
#             return Response({"error": "Not enough stock"}, status=status.HTTP_400_BAD_REQUEST)

#         cart_item, created = Cart.objects.get_or_create(product=product, defaults={'quantity': quantity})
#         if not created:
#             cart_item.quantity += int(quantity)
#             cart_item.save()

#         serializer = self.get_serializer(cart_item)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

# class CartDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Cart.objects.all()
#     serializer_class = CartSerializer

# class StockDetail(generics.RetrieveAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

# class CategoryList(generics.ListAPIView):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer

# class RegionList(generics.ListAPIView):
#     queryset = Region.objects.all()
#     serializer_class = RegionSerializer


from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .models import Category, Region, Product, Cart
from .serializers import CategorySerializer, RegionSerializer, ProductSerializer, CartSerializer

@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        queryset = Product.objects.all()
        category_id = request.query_params.get('category_id', None)
        region_id = request.query_params.get('region_id', None)
        min_price = request.query_params.get('min_price', None)
        max_price = request.query_params.get('max_price', None)

        if category_id is not None:
            queryset = queryset.filter(category_id=category_id)
        if region_id is not None:
            queryset = queryset.filter(region_id=region_id)
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        if product.stock_quantity < int(quantity):
            return Response({"error": "Not enough stock"}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, created = Cart.objects.get_or_create(product=product, defaults={'quantity': quantity})
        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()

        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def cart_list(request):
    if request.method == 'GET':
        queryset = Cart.objects.all()
        serializer = CartSerializer(queryset, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        product_id = request.data.get('product')
        quantity = request.data.get('quantity')

        product = get_object_or_404(Product, pk=product_id)

        # Check if enough stock is available
        if product.stock_quantity < quantity:
            return Response({'error': 'Not enough stock available'}, status=400)

        # Add to cart or update quantity if already in cart
        cart_item, created = Cart.objects.get_or_create(product=product)
        cart_item.quantity += int(quantity)
        cart_item.save()

        serializer = ProductSerializer(cart_item)
        return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def cart_detail(request, pk):
    cart_item = get_object_or_404(Cart, pk=pk)

    if request.method == 'GET':
        serializer = CartSerializer(cart_item)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CartSerializer(cart_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def stock_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
def category_list(request):
    queryset = Category.objects.all()
    serializer = CategorySerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def region_list(request):
    queryset = Region.objects.all()
    serializer = RegionSerializer(queryset, many=True)
    return Response(serializer.data)


# @api_view(['POST'])
# def add_to_cart(request):
#     product_id = request.data.get('product')
#     quantity = request.data.get('quantity')

#     product = get_object_or_404(Product, pk=product_id)

#     # Check if enough stock is available
#     if product.stock_quantity < quantity:
#         return Response({'error': 'Not enough stock available'}, status=400)

#     # Add to cart or update quantity if already in cart
#     cart_item, created = Cart.objects.get_or_create(product=product)
#     cart_item.quantity += int(quantity)
#     cart_item.save()

#     serializer = CartItemSerializer(cart_item)
#     return Response(serializer.data)


