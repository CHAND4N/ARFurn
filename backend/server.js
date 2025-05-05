const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cartdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Define Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  id: Number,       // Product ID
  name: String,     // Product name
  price: Number,    // Product price
  quantity: Number, // Product quantity
});

// Create Cart Model
const CartItem = mongoose.model('CartItem', cartItemSchema);

// Add product to cart (with quantity update if already exists)
app.post('/cart', async (req, res) => {
  try {
    const { id, name, price, quantity } = req.body;

    const existingProduct = await CartItem.findOne({ id });

    if (existingProduct) {
      existingProduct.quantity += quantity;

      if (existingProduct.quantity <= 0) {
        await existingProduct.deleteOne();
        console.log(`Product with id ${id} removed from cart.`);
        res.status(200).json({ message: 'Product removed' });
      } else {
        await existingProduct.save();
        console.log(`Updated product quantity:`, existingProduct);
        res.status(200).json({ message: 'Product quantity updated', product: existingProduct });
      }
    } else {
      if (quantity > 0) {
        const newProduct = new CartItem({ id, name, price, quantity });
        await newProduct.save();
        console.log('Added new product:', newProduct);
        res.status(201).json({ message: 'New product added to cart', product: newProduct });
      } else {
        res.status(400).json({ message: 'Cannot add product with negative quantity' });
      }
    }
  } catch (error) {
    console.error('Error adding/updating cart:', error);
    res.status(500).json({ message: 'Error adding product to cart', error });
  }
});

// Get all cart items
app.get('/cart', async (req, res) => {
  try {
    const cart = await CartItem.find();
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error });
  }
});

// Remove product from cart (delete by ID)
app.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await CartItem.findOneAndDelete({ id: parseInt(id, 10) });

    if (deletedItem) {
      res.status(200).json({ message: 'Product removed from cart', deletedItem });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
