import { Request, Response } from 'express';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    let cart = mockDataStore.carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = { id: `cart-${userId}`, userId, items: [] };
      mockDataStore.carts.push(cart);
    }

    // Populate item details & group by seller
    const populatedItems: any[] = [];
    let grossTotal = 0;

    for (const item of cart.items) {
      const product = mockDataStore.products.find((p) => p.id === item.productId);
      if (product) {
        const seller = mockDataStore.sellers.find((s) => s.id === product.sellerId);
        const itemTotal = product.basePrice * item.quantity;
        grossTotal += itemTotal;

        populatedItems.push({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: product.imageUrl,
          unitPrice: product.basePrice,
          quantity: item.quantity,
          itemTotal,
          stockAvailable: product.stockQuantity,
          seller: seller
            ? {
                id: seller.id,
                businessName: seller.businessName,
                city: seller.city,
                state: seller.state,
              }
            : null,
        });
      }
    }

    // Group items seller-wise
    const sellerGroups: Record<string, any> = {};
    for (const item of populatedItems) {
      const sellerId = item.seller?.id || 'unknown';
      if (!sellerGroups[sellerId]) {
        sellerGroups[sellerId] = {
          sellerId,
          businessName: item.seller?.businessName || 'Mahilo Seller',
          items: [],
          subTotal: 0,
          shippingCharge: 40.00, // Standard ₹40 delivery per seller
        };
      }
      sellerGroups[sellerId].items.push(item);
      sellerGroups[sellerId].subTotal += item.itemTotal;
    }

    const groupsArray = Object.values(sellerGroups);
    const totalShipping = groupsArray.length > 0 ? groupsArray.reduce((acc, g) => acc + g.shippingCharge, 0) : 0;
    const netPayable = grossTotal + totalShipping;

    return sendSuccess(res, {
      items: populatedItems,
      sellerGroups: groupsArray,
      summary: {
        itemCount: cart.items.reduce((acc: number, it: any) => acc + it.quantity, 0),
        grossTotal,
        totalShipping,
        discount: 0,
        netPayable,
      },
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { productId, quantity = 1 } = req.body;
    if (!productId) return sendError(res, 'Product ID required', 400);

    const product = mockDataStore.products.find((p) => p.id === productId);
    if (!product) return sendError(res, 'Product not found', 404);

    if (product.stockQuantity < quantity) {
      return sendError(res, `Only ${product.stockQuantity} units available in stock`, 400);
    }

    let cart = mockDataStore.carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = { id: `cart-${userId}`, userId, items: [] };
      mockDataStore.carts.push(cart);
    }

    const existingItem = cart.items.find((it: any) => it.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, unitPrice: product.basePrice });
    }

    return sendSuccess(res, cart, 'Product added to your cart');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = mockDataStore.carts.find((c) => c.userId === userId);
    if (!cart) return sendError(res, 'Cart not found', 404);

    const item = cart.items.find((it: any) => it.productId === productId);
    if (!item) return sendError(res, 'Item not found in cart', 404);

    if (quantity <= 0) {
      cart.items = cart.items.filter((it: any) => it.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    return sendSuccess(res, cart, 'Cart updated');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;

    const cart = mockDataStore.carts.find((c) => c.userId === userId);
    if (!cart) return sendError(res, 'Cart not found', 404);

    cart.items = cart.items.filter((it: any) => it.productId !== productId);
    return sendSuccess(res, cart, 'Item removed from cart');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
