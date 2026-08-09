import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, AlertTriangle, CheckCircle, Package, DollarSign, Image as ImageIcon, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  reservedStock: number;
  lowStockAlert: number;
  status: 'Active' | 'Draft' | 'Out of Stock' | 'Archived';
  image: string;
  description?: string;
}

interface ProductsManagementProps {
  currentRole: string;
  onRefreshOrders?: () => void;
}

export const ProductsManagement: React.FC<ProductsManagementProps> = ({ currentRole }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Bifold Wallets',
    price: '',
    salePrice: '',
    costPrice: '',
    stock: '',
    reservedStock: '0',
    lowStockAlert: '5',
    status: 'Active' as Product['status'],
    image: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  const canManageProducts = ['Store Owner', 'Admin', 'Inventory Manager'].includes(currentRole);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-LC-${Math.floor(100 + Math.random() * 899)}`,
      category: 'Bifold Wallets',
      price: '5499',
      salePrice: '4999',
      costPrice: '2200',
      stock: '20',
      reservedStock: '0',
      lowStockAlert: '5',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      description: 'Handcrafted top-grain Italian leather.'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : String(p.price),
      costPrice: p.costPrice ? String(p.costPrice) : '2000',
      stock: String(p.stock),
      reservedStock: String(p.reservedStock || 0),
      lowStockAlert: String(p.lowStockAlert || 5),
      status: p.status,
      image: p.image,
      description: p.description || ''
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageProducts) {
      alert(`Role "${currentRole}" does not have permission to modify products.`);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: Number(formData.price) || 0,
        salePrice: Number(formData.salePrice) || Number(formData.price) || 0,
        costPrice: Number(formData.costPrice) || 0,
        stock: Number(formData.stock) || 0,
        reservedStock: Number(formData.reservedStock) || 0,
        lowStockAlert: Number(formData.lowStockAlert) || 5,
        status: formData.status,
        image: formData.image,
        description: formData.description,
        adminName: 'Admin',
        adminRole: currentRole
      };

      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data.product : p)));
          setShowModal(false);
        }
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProducts((prev) => [data.product, ...prev]);
          setShowModal(false);
        }
      }
    } catch (err) {
      console.error('Failed to save product', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!canManageProducts) {
      alert(`Role "${currentRole}" does not have permission to delete products.`);
      return;
    }
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: Product['status'], stock: number, lowAlert: number) => {
    if (status === 'Archived') {
      return <span className="px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-full font-bold">Archived</span>;
    }
    if (status === 'Draft') {
      return <span className="px-2 py-0.5 text-[10px] bg-purple-950 text-purple-300 border border-purple-800/50 rounded-full font-bold">Draft</span>;
    }
    if (stock === 0 || status === 'Out of Stock') {
      return <span className="px-2 py-0.5 text-[10px] bg-red-950 text-red-300 border border-red-800/50 rounded-full font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Out of Stock</span>;
    }
    if (stock <= lowAlert) {
      return <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 border border-amber-800/50 rounded-full font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Low Stock ({stock})</span>;
    }
    return <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 rounded-full font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>;
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30">
        <div>
          <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Products Catalog Management ({filteredProducts.length})</span>
          </h3>
          <p className="text-xs text-zinc-400">Add, edit, manage pricing, SKU codes, stock levels & product statuses</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-800/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {canManageProducts && (
            <button
              onClick={handleOpenAdd}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-72 bg-zinc-950 border border-zinc-700/60 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search name, SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-amber-100 placeholder-zinc-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-700/60 px-2.5 py-1.5 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-amber-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All Categories</option>
              <option value="Designer Inspired" className="bg-zinc-900">Designer Inspired</option>
              <option value="Bifold Wallets" className="bg-zinc-900">Bifold Wallets</option>
              <option value="RFID Smart Wallets" className="bg-zinc-900">RFID Smart Wallets</option>
              <option value="Executive & Passport" className="bg-zinc-900">Executive & Passport</option>
              <option value="Minimalist Cardholders" className="bg-zinc-900">Minimalist Cardholders</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-700/60 px-2.5 py-1.5 rounded-lg">
            <span className="text-zinc-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-amber-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All Statuses</option>
              <option value="Active" className="bg-zinc-900">Active</option>
              <option value="Draft" className="bg-zinc-900">Draft</option>
              <option value="Out of Stock" className="bg-zinc-900">Out of Stock</option>
              <option value="Archived" className="bg-zinc-900">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-950/80 border border-amber-800/30 rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900 border-b border-amber-800/30 text-amber-300 font-serif font-bold uppercase text-[11px]">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Regular / Sale Price</th>
              <th className="p-3 text-right">Cost Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-500">
                  No products found matching filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-amber-800/30 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-amber-100">{p.name}</div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1">{p.description}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 font-mono text-zinc-300 font-semibold">{p.sku}</td>
                  <td className="p-3 text-zinc-300">{p.category}</td>

                  <td className="p-3 text-right font-mono">
                    <div className="font-bold text-amber-300">Rs. {(p.salePrice || p.price).toLocaleString('en-PK')}</div>
                    {p.salePrice && p.salePrice < p.price && (
                      <div className="text-[10px] text-zinc-500 line-through">Rs. {p.price.toLocaleString('en-PK')}</div>
                    )}
                  </td>

                  <td className="p-3 text-right font-mono text-zinc-400">
                    Rs. {(p.costPrice || 0).toLocaleString('en-PK')}
                  </td>

                  <td className="p-3 text-center font-mono">
                    <span className={`font-bold px-2 py-0.5 rounded ${p.stock <= p.lowStockAlert ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-zinc-200'}`}>
                      {p.stock} units
                    </span>
                  </td>

                  <td className="p-3">
                    {getStatusBadge(p.status, p.stock, p.lowStockAlert)}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded border border-amber-800/40"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 rounded border border-red-800/50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-zinc-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-amber-800/60 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-amber-100 text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <span>{editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-zinc-400 mb-1 font-semibold">Product Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. The Sovereign Italian Bifold"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">SKU Code *</label>
                  <input
                    required
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none"
                  >
                    <option value="Designer Inspired">Designer Inspired</option>
                    <option value="Bifold Wallets">Bifold Wallets</option>
                    <option value="RFID Smart Wallets">RFID Smart Wallets</option>
                    <option value="Executive & Passport">Executive & Passport</option>
                    <option value="Minimalist Cardholders">Minimalist Cardholders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Regular Price (PKR) *</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Sale Price (PKR) *</label>
                  <input
                    required
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Cost Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="For profit calculation"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Current Stock Quantity *</label>
                  <input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Low Stock Alert Limit</label>
                  <input
                    type="number"
                    value={formData.lowStockAlert}
                    onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Product Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Product['status'] })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-zinc-400 mb-1 font-semibold">Product Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-zinc-400 mb-1 font-semibold">Short Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase rounded-xl transition-all shadow-lg text-xs tracking-wider"
              >
                {saving ? 'Saving Product...' : 'Save Product Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
