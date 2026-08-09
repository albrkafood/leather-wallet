import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  MessageCircle,
  Phone,
  Send,
  XCircle,
  Copy,
  Edit,
  CheckCircle2,
  Clock,
  Truck,
  Box,
  MapPin,
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Package,
  Save,
  Check,
  Plus,
  DollarSign,
  History,
  AlertCircle,
  Tag as TagIcon,
  StickyNote,
  Trash2,
  RefreshCw,
  RotateCcw,
  Percent,
  CheckSquare
} from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onUpdateOrder: (updatedOrder: any) => void;
  onDeleteOrder?: (id: string) => void;
  onDuplicateOrder?: (order: any) => void;
  onOpenPrintInvoice: (orders: any[]) => void;
  onOpenPrintPackingSlip: (orders: any[]) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateOrder,
  onDeleteOrder,
  onDuplicateOrder,
  onOpenPrintInvoice,
  onOpenPrintPackingSlip,
}) => {
  if (!isOpen || !order) return null;

  // Phone Copy State
  const [phoneCopied, setPhoneCopied] = useState(false);

  // SECTION 10: Order Tags State
  const presetTags = ['VIP', 'Urgent', 'Repeat Customer', 'High Value', 'COD', 'Wholesale', 'Gift', 'International'];
  const [tags, setTags] = useState<string[]>(order.tags || ['VIP', 'COD']);
  const [customTagInput, setCustomTagInput] = useState('');

  // SECTION 9: Internal Admin Notes State
  const [internalNotesList, setInternalNotesList] = useState<any[]>(
    order.internalNotesList || [
      {
        id: 'note_1',
        noteText: order.adminNotes || 'Customer requested delivery after 5 PM.',
        adminName: 'Super Admin',
        date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: '10:25 AM',
      }
    ]
  );
  const [newNoteText, setNewNoteText] = useState('');
  const [adminAuthorName, setAdminAuthorName] = useState('Super Admin');

  // SECTION 8: Customer Communication WhatsApp Templates
  const [showWaTemplateModal, setShowWaTemplateModal] = useState(false);
  const [selectedWaTemplate, setSelectedWaTemplate] = useState('Order Confirmation');

  // SECTION 11: Order Items & Order Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editedFullName, setEditedFullName] = useState(order.shipping?.fullName || '');
  const [editedPhone, setEditedPhone] = useState(order.shipping?.phone || '');
  const [editedAddress, setEditedAddress] = useState(order.shipping?.address || '');
  const [editedCity, setEditedCity] = useState(order.shipping?.city || 'Lahore');
  const [editedLandmark, setEditedLandmark] = useState(order.shipping?.nearestLandmark || '');
  const [editedStatus, setEditedStatus] = useState(order.status || 'Order Placed');
  const [editedPaymentStatus, setEditedPaymentStatus] = useState<string>(order.paymentStatus || 'Pending');
  const [editedPaymentMethod, setEditedPaymentMethod] = useState<string>(order.paymentMethod || 'Cash on Delivery');
  const [courier, setCourier] = useState<string>(order.courierName || 'TCS');
  const [trackingNumber, setTrackingNumber] = useState<string>(order.trackingNumber || '');
  const [shippingMethod, setShippingMethod] = useState<string>(order.shippingMethod || 'Standard Express Courier');
  const [shippingCost, setShippingCost] = useState<number>(order.shippingCost !== undefined ? order.shippingCost : 200);
  const [discountAmount, setDiscountAmount] = useState<number>(order.discountAmount || 0);

  // Editable Purchased Items
  const [orderItems, setOrderItems] = useState<any[]>(order.items || []);

  // Calculate Subtotal & Total
  const subtotalAmount = orderItems.reduce((acc, item) => {
    const p = item.product?.price || item.price || 0;
    const q = item.quantity || 1;
    return acc + p * q;
  }, 0);

  const totalAmount = Math.max(0, subtotalAmount - discountAmount + shippingCost);

  // SECTION 11: Activity Log / Modification History
  const [activityLog, setActivityLog] = useState<any[]>(
    order.activityLog || [
      {
        id: 'act_1',
        action: 'Order Created',
        details: `Order #${order.trackingNumber} generated with total Rs. ${totalAmount.toLocaleString('en-PK')}`,
        timestamp: new Date(order.createdAt || Date.now()).toLocaleString('en-PK'),
        adminName: 'System'
      }
    ]
  );

  // SECTION 6: Payment Management State
  const [amountCollected, setAmountCollected] = useState<number>(
    order.amountCollected !== undefined
      ? order.amountCollected
      : (order.paymentStatus === 'Paid' ? totalAmount : 0)
  );

  const codAmount = totalAmount;
  const remainingAmount = Math.max(0, codAmount - amountCollected);

  const [paymentHistory, setPaymentHistory] = useState<any[]>(
    order.paymentHistory || [
      {
        id: 'pay_1',
        date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        amount: order.paymentStatus === 'Paid' ? totalAmount : (amountCollected || 0),
        method: order.paymentMethod || 'Cash on Delivery',
        transactionId: order.transactionId || `TXN-${order.trackingNumber || '1001'}`,
        status: order.paymentStatus || 'Pending',
      }
    ]
  );

  // New Payment Modal State
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPayDate, setNewPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPayAmount, setNewPayAmount] = useState<number>(remainingAmount > 0 ? remainingAmount : totalAmount);
  const [newPayMethod, setNewPayMethod] = useState<string>('Bank Transfer');
  const [newPayTxnId, setNewPayTxnId] = useState<string>(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [newPayStatus, setNewPayStatus] = useState<string>('Paid');

  // SECTION 7: Shipping Logistics Dates
  const [dispatchDate, setDispatchDate] = useState<string>(
    order.dispatchDate || (order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : '')
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>(
    order.expectedDeliveryDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [deliveryDate, setDeliveryDate] = useState<string>(order.deliveryDate || '');

  // SECTION 12: Cancel / Return / Refund Modal States
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Customer Requested');
  const [cancelNotes, setCancelNotes] = useState('');

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnStatus, setReturnStatus] = useState('Return Requested');
  const [returnReason, setReturnReason] = useState('Defective / Wrong Size');
  const [refundAmount, setRefundAmount] = useState<number>(totalAmount);
  const [refundMethod, setRefundMethod] = useState('Bank Transfer');

  const courierOptions = ['TCS', 'Leopards', 'M&P', 'Trax', 'PostEx', 'BlueEx', 'Other'];
  const paymentMethodsList = ['Cash on Delivery', 'Bank Transfer', 'Easypaisa', 'JazzCash', 'Card', 'Online Payment'];
  const paymentStatusList = ['Pending', 'Paid', 'Partially Paid', 'Refunded', 'COD'];

  // Phone Copy Helper
  const cleanPhone = order.shipping?.phone?.replace(/[^0-9]/g, '') || '';
  const formattedPhoneForWa = cleanPhone.startsWith('0') ? `92${cleanPhone.slice(1)}` : cleanPhone;

  const handleCopyPhone = () => {
    if (order.shipping?.phone) {
      navigator.clipboard.writeText(order.shipping.phone);
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2000);
    }
  };

  // WhatsApp Message Generator based on template
  const getWaMessage = (templateType: string) => {
    const custName = editedFullName || order.shipping?.fullName || 'Valued Customer';
    const ordNo = trackingNumber || order.trackingNumber;
    const amt = `Rs. ${totalAmount.toLocaleString('en-PK')}`;

    switch (templateType) {
      case 'Order Confirmation':
        return (
          `Assalam o Alaikum ${custName}!\n\n` +
          `Thank you for placing your order *#${ordNo}* with LeatherCraft PK!\n` +
          `💵 *Total Amount:* ${amt} (${editedPaymentMethod})\n` +
          `📦 *Status:* Confirmed & in Preparation\n\n` +
          `We will notify you once dispatched. Thank you for choosing genuine Pakistani leather craft!`
        );
      case 'Order Processing':
        return (
          `Assalam o Alaikum ${custName}!\n\n` +
          `Your LeatherCraft PK Order *#${ordNo}* is currently being *Processed & Handcrafted*.\n` +
          `💵 *Total Amount:* ${amt}\n\n` +
          `Our master artisans are inspecting your item for quality assurance.`
        );
      case 'Order Ready to Ship':
        return (
          `Assalam o Alaikum ${custName}!\n\n` +
          `Great news! Your Order *#${ordNo}* is *Packed & Ready to Ship*!\n` +
          `🚚 *Courier Partner:* ${courier}\n` +
          `💵 *Amount Payable:* ${amt}\n\n` +
          `Your tracking ID will be generated shortly.`
        );
      case 'Order Dispatched':
        return (
          `Assalam o Alaikum ${custName}!\n\n` +
          `Your LeatherCraft PK Order *#${ordNo}* has been *Dispatched*!\n` +
          `🚚 *Courier:* ${courier}\n` +
          `📍 *Tracking Number:* ${ordNo}\n` +
          `💵 *Amount to Pay:* ${amt}\n` +
          `📅 *Expected Delivery:* ${expectedDeliveryDate}\n\n` +
          `Thank you for shopping with us!`
        );
      case 'Order Out for Delivery':
        return (
          `Assalam o Alaikum ${custName}!\n\n` +
          `Your Order *#${ordNo}* is *Out for Delivery* today via *${courier}*!\n` +
          `📍 *Delivery Address:* ${editedAddress}, ${editedCity}\n` +
          `💵 *COD Amount to Collect:* ${amt}\n\n` +
          `Please keep cash ready. Rider will call you shortly.`
        );
      case 'Order Delivered':
        return (
          `Assalam o Alaikum ${custName}!\n\n` +
          `Your Order *#${ordNo}* has been marked as *Delivered*!\n` +
          `We hope you love your handcrafted leather product. Please feel free to share your review.`
        );
      case 'Order Cancelled':
        return (
          `Assalam o Alaikum ${custName}!\n\n` +
          `This is regarding your Order *#${ordNo}*.\n` +
          `Your order has been *Cancelled*. If you have any questions, please reply to this message.`
        );
      default:
        return `Assalam o Alaikum ${custName}! Order #${ordNo} total: ${amt}.`;
    }
  };

  // Section 10: Tag Handlers
  const handleToggleTag = (tag: string) => {
    let updated: string[];
    if (tags.includes(tag)) {
      updated = tags.filter(t => t !== tag);
    } else {
      updated = [...tags, tag];
    }
    setTags(updated);
    addLogEvent('Tags Updated', `Tags changed to: ${updated.join(', ') || 'None'}`);
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTagInput.trim() && !tags.includes(customTagInput.trim())) {
      const updated = [...tags, customTagInput.trim()];
      setTags(updated);
      setCustomTagInput('');
      addLogEvent('Tag Added', `Added tag "${customTagInput.trim()}"`);
    }
  };

  // Section 9: Add Internal Note
  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNoteObj = {
      id: `note_${Date.now()}`,
      noteText: newNoteText.trim(),
      adminName: adminAuthorName || 'Super Admin',
      date: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedNotes = [newNoteObj, ...internalNotesList];
    setInternalNotesList(updatedNotes);
    setNewNoteText('');
    addLogEvent('Internal Note Added', `Note added by ${adminAuthorName}: "${newNoteObj.noteText}"`);
  };

  // Helper to append Activity Log
  const addLogEvent = (action: string, details: string) => {
    const newEvt = {
      id: `act_${Date.now()}`,
      action,
      details,
      timestamp: new Date().toLocaleString('en-PK'),
      adminName: 'Super Admin',
    };
    setActivityLog(prev => [newEvt, ...prev]);
  };

  // Section 11: Edit Products in Order
  const handleItemQtyChange = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...orderItems];
    const oldQty = updated[index].quantity;
    updated[index].quantity = newQty;
    setOrderItems(updated);
    addLogEvent('Product Quantity Changed', `${updated[index].name || 'Item'} quantity changed from ${oldQty} to ${newQty}`);
  };

  const handleRemoveItem = (index: number) => {
    const itemToRemove = orderItems[index];
    const updated = orderItems.filter((_, i) => i !== index);
    setOrderItems(updated);
    addLogEvent('Product Removed', `Removed ${itemToRemove.name || 'Item'} from order`);
  };

  const handleAddProductToOrder = () => {
    const name = prompt('Enter Product Name:', 'Handcrafted Leather Cardholder');
    if (!name) return;
    const priceStr = prompt('Enter Item Price (Rs.):', '2500');
    if (!priceStr) return;
    const qtyStr = prompt('Enter Quantity:', '1');

    const newItem = {
      product: { name, price: Number(priceStr), image: '' },
      name,
      price: Number(priceStr),
      quantity: Number(qtyStr || 1),
      selectedColor: { name: 'Tan Brown' },
    };

    const updated = [...orderItems, newItem];
    setOrderItems(updated);
    addLogEvent('Product Added', `Added ${qtyStr}x ${name} @ Rs. ${priceStr}`);
  };

  // Section 11: Save Full Edits
  const handleSaveFullEdit = () => {
    const updatedOrder = {
      ...order,
      total: totalAmount,
      subtotal: subtotalAmount,
      discountAmount,
      shippingCost,
      status: editedStatus,
      paymentStatus: editedPaymentStatus,
      paymentMethod: editedPaymentMethod,
      courierName: courier,
      trackingNumber,
      shippingMethod,
      dispatchDate,
      expectedDeliveryDate,
      deliveryDate,
      tags,
      internalNotesList,
      activityLog,
      items: orderItems,
      shipping: {
        ...order.shipping,
        fullName: editedFullName,
        phone: editedPhone,
        address: editedAddress,
        city: editedCity,
        nearestLandmark: editedLandmark,
      },
      updatedAt: new Date().toISOString(),
    };

    addLogEvent('Order Saved', 'Order details updated and recalculated');
    onUpdateOrder(updatedOrder);
    setIsEditing(false);
  };

  // Section 12: Perform Cancel
  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStatus = 'Cancelled';
    setEditedStatus(updatedStatus);

    const cancelLogDetails = `Cancellation Reason: ${cancelReason}. Notes: ${cancelNotes || 'None'}`;
    addLogEvent('Order Cancelled', cancelLogDetails);

    const updatedOrder = {
      ...order,
      status: updatedStatus,
      cancelReason,
      cancelNotes,
      activityLog: [
        {
          id: `act_${Date.now()}`,
          action: 'Order Cancelled',
          details: cancelLogDetails,
          timestamp: new Date().toLocaleString('en-PK'),
          adminName: 'Super Admin',
        },
        ...activityLog,
      ],
      updatedAt: new Date().toISOString(),
    };

    onUpdateOrder(updatedOrder);
    setShowCancelModal(false);
  };

  // Section 12: Perform Return / Refund
  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStatus = returnStatus;
    setEditedStatus(updatedStatus);

    const returnLogDetails = `Return Status: ${returnStatus}. Reason: ${returnReason}. Refund Rs. ${refundAmount} via ${refundMethod}`;
    addLogEvent('Return / Refund Updated', returnLogDetails);

    const updatedOrder = {
      ...order,
      status: updatedStatus,
      paymentStatus: returnStatus === 'Refunded' ? 'Refunded' : editedPaymentStatus,
      returnReason,
      refundAmount,
      refundMethod,
      activityLog: [
        {
          id: `act_${Date.now()}`,
          action: `Return: ${returnStatus}`,
          details: returnLogDetails,
          timestamp: new Date().toLocaleString('en-PK'),
          adminName: 'Super Admin',
        },
        ...activityLog,
      ],
      updatedAt: new Date().toISOString(),
    };

    onUpdateOrder(updatedOrder);
    setShowReturnModal(false);
  };

  // Payment Recording
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      id: `pay_${Date.now()}`,
      date: newPayDate,
      amount: Number(newPayAmount),
      method: newPayMethod,
      transactionId: newPayTxnId,
      status: newPayStatus,
    };

    const updatedHistory = [newRecord, ...paymentHistory];
    const newTotalCollected = amountCollected + Number(newPayAmount);
    setAmountCollected(newTotalCollected);
    setPaymentHistory(updatedHistory);

    let updatedPaymentStatus = editedPaymentStatus;
    if (newTotalCollected >= totalAmount) {
      updatedPaymentStatus = 'Paid';
    } else if (newTotalCollected > 0) {
      updatedPaymentStatus = 'Partially Paid';
    }

    setEditedPaymentStatus(updatedPaymentStatus);
    addLogEvent('Payment Recorded', `Recorded Rs. ${newPayAmount} via ${newPayMethod} (Txn #${newPayTxnId})`);

    const updatedOrder = {
      ...order,
      paymentStatus: updatedPaymentStatus,
      amountCollected: newTotalCollected,
      paymentHistory: updatedHistory,
      updatedAt: new Date().toISOString()
    };

    onUpdateOrder(updatedOrder);
    setShowAddPaymentModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-amber-800/40 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-zinc-100">
        
        {/* TOP BAR HEADER */}
        <div className="px-5 py-4 bg-zinc-950 border-b border-amber-800/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
              LCPK
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-lg font-bold text-amber-100">
                  Order #{trackingNumber || order.trackingNumber}
                </h2>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded font-mono font-semibold">
                  {new Date(order.createdAt || Date.now()).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
                </span>
                
                {/* Section 10: Tags Badges in Header */}
                {tags.map(t => (
                  <span key={t} className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    #{t}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-400">Shopify-Grade Order Intelligence, Editing & Logistics Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>{isEditing ? 'View Mode' : 'Edit Order'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-amber-200 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STATUS BADGES & ACTION TOOLBAR */}
        <div className="px-5 py-3 bg-zinc-950/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-600/50 px-2.5 py-1 rounded-lg text-amber-200 font-bold">
              <span className="text-[10px] text-zinc-400 uppercase">Status:</span>
              <span>{editedStatus}</span>
            </div>

            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold border ${
              editedPaymentStatus === 'Paid'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                : editedPaymentStatus === 'Partially Paid'
                ? 'bg-blue-950/80 text-blue-300 border-blue-600/50'
                : editedPaymentStatus === 'Refunded'
                ? 'bg-purple-950/80 text-purple-300 border-purple-600/50'
                : 'bg-amber-950/80 text-amber-300 border-amber-600/50'
            }`}>
              <span className="text-[10px] text-zinc-400 uppercase">Payment:</span>
              <span>{editedPaymentStatus} ({editedPaymentMethod})</span>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-lg font-bold text-zinc-300">
              <span className="text-[10px] text-zinc-400 uppercase">Courier:</span>
              <span>{courier}</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onOpenPrintInvoice([order])}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-amber-200 rounded-lg flex items-center gap-1 text-[11px] font-semibold border border-zinc-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Invoice</span>
            </button>

            <button
              onClick={() => onOpenPrintPackingSlip([order])}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-amber-200 rounded-lg flex items-center gap-1 text-[11px] font-semibold border border-zinc-700 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              <span>Packing Slip</span>
            </button>

            {/* SECTION 8: CUSTOMER COMMUNICATION BUTTONS */}
            <button
              onClick={() => setShowWaTemplateModal(true)}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-lg flex items-center gap-1 text-[11px] font-extrabold shadow transition-transform hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-zinc-950" />
              <span>WhatsApp Predefined</span>
            </button>

            {/* SECTION 12: CANCEL & RETURN BUTTONS */}
            <button
              onClick={() => setShowReturnModal(true)}
              className="p-2 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-lg flex items-center gap-1 text-[11px] font-semibold border border-blue-800/60"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
              <span>Return / Refund</span>
            </button>

            {editedStatus !== 'Cancelled' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="p-2 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-lg flex items-center gap-1 text-[11px] font-semibold border border-red-800/60"
              >
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                <span>Cancel Order</span>
              </button>
            )}
          </div>
        </div>

        {/* MODAL MAIN CONTENT */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">

          {/* SECTION 8: CUSTOMER COMMUNICATION BAR */}
          <div className="bg-zinc-950 border border-amber-800/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-amber-100">Customer Communication:</span>
              <span className="font-mono text-zinc-300 font-semibold">{order.shipping?.phone || 'No Phone'}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Copy Phone Number */}
              <button
                onClick={handleCopyPhone}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-1.5 font-semibold text-xs border border-zinc-700"
              >
                {phoneCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{phoneCopied ? 'Phone Copied!' : 'Copy Phone'}</span>
              </button>

              {/* Call Customer */}
              {order.shipping?.phone && (
                <a
                  href={`tel:${order.shipping.phone}`}
                  className="px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 rounded-lg flex items-center gap-1.5 font-semibold text-xs border border-indigo-700"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Call Customer</span>
                </a>
              )}

              {/* WhatsApp Direct */}
              {formattedPhoneForWa && (
                <a
                  href={`https://wa.me/${formattedPhoneForWa}?text=${encodeURIComponent(getWaMessage('Order Confirmation'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-extrabold rounded-lg flex items-center gap-1.5 text-xs shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-zinc-950" />
                  <span>WhatsApp Customer</span>
                </a>
              )}
            </div>
          </div>

          {/* SECTION 11: FULL EDITING MODE PANEL */}
          {isEditing && (
            <div className="bg-zinc-950 border border-amber-800/60 p-5 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-serif font-bold text-amber-100 text-sm flex items-center gap-2">
                  <Edit className="w-4 h-4 text-amber-400" />
                  <span>11. Edit Order Details (Before Dispatch)</span>
                </h3>
                <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  Totals Recalculated Automatically
                </span>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Customer Name</label>
                  <input
                    type="text"
                    value={editedFullName}
                    onChange={(e) => setEditedFullName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={editedCity}
                    onChange={(e) => setEditedCity(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1 font-semibold">Address</label>
                  <input
                    type="text"
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Landmark</label>
                  <input
                    type="text"
                    value={editedLandmark}
                    onChange={(e) => setEditedLandmark(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Shipping Cost (Rs.)</label>
                  <input
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-amber-300 font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Discount Amount (Rs.)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-emerald-400 font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Order Status</label>
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-600/60 rounded-lg p-2 text-amber-200 font-bold focus:outline-none"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Ready to Ship">Ready to Ship</option>
                    <option value="Dispatched via TCS">Dispatched via TCS</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
              </div>

              {/* Edit Products in Order */}
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-200 text-xs">Edit Products & Quantities:</h4>
                  <button
                    onClick={handleAddProductToOrder}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-lg flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                      <div className="flex-1">
                        <span className="font-bold text-amber-100">{item.product?.name || item.name}</span>
                        <span className="text-zinc-400 text-[11px] block">
                          Price: Rs. {(item.product?.price || item.price || 0).toLocaleString('en-PK')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 font-semibold">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || 1}
                          onChange={(e) => handleItemQtyChange(idx, Number(e.target.value))}
                          className="w-16 bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-center font-mono font-bold text-amber-300"
                        />
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recalculated Summary Bar */}
              <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div className="space-x-4 text-xs font-mono">
                  <span>Subtotal: <strong className="text-amber-200">Rs. {subtotalAmount.toLocaleString('en-PK')}</strong></span>
                  <span>Discount: <strong className="text-emerald-400">- Rs. {discountAmount.toLocaleString('en-PK')}</strong></span>
                  <span>Shipping: <strong className="text-amber-300">+ Rs. {shippingCost.toLocaleString('en-PK')}</strong></span>
                </div>

                <div className="text-right">
                  <span className="text-zinc-400 font-semibold text-xs mr-2">New Recalculated Total:</span>
                  <span className="font-serif font-extrabold text-base text-amber-300">
                    Rs. {totalAmount.toLocaleString('en-PK')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFullEdit}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-1.5 text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 10: ORDER TAGS CARD */}
          <div className="bg-zinc-950 border border-amber-800/30 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h4 className="font-serif font-bold text-amber-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <TagIcon className="w-4 h-4 text-amber-400" />
                <span>10. Order Tags</span>
              </h4>
              <span className="text-[10px] text-zinc-500">Categorize and label order</span>
            </div>

            {/* Active Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {tags.map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-bold text-xs"
                >
                  #{t}
                  <button onClick={() => handleToggleTag(t)} className="hover:text-red-400 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {tags.length === 0 && <span className="text-zinc-500 italic text-xs">No tags assigned.</span>}
            </div>

            {/* Quick Preset Tag Toggles */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
              <span className="text-[11px] text-zinc-400 font-semibold block">Quick Add Preset Tag:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {presetTags.map(pt => {
                  const isActive = tags.includes(pt);
                  return (
                    <button
                      key={pt}
                      onClick={() => handleToggleTag(pt)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                        isActive
                          ? 'bg-amber-500 text-zinc-950 border-amber-400'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-amber-200 hover:bg-zinc-800'
                      }`}
                    >
                      {isActive ? '✓ ' : '+ '}{pt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Tag Input */}
            <form onSubmit={handleAddCustomTag} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Type custom tag..."
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold rounded-lg text-xs border border-zinc-700"
              >
                Add Tag
              </button>
            </form>
          </div>

          {/* SECTION 9: INTERNAL ORDER NOTES CARD */}
          <div className="bg-zinc-950 border border-amber-800/30 p-4 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h4 className="font-serif font-bold text-amber-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <StickyNote className="w-4 h-4 text-amber-400" />
                <span>9. Internal Admin Notes (Admin Only)</span>
              </h4>
              <span className="text-[10px] text-amber-400/80 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/60 font-semibold">
                Private & Secure
              </span>
            </div>

            {/* Add New Note Input */}
            <form onSubmit={handleAddInternalNote} className="space-y-2 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Author Name (e.g. Super Admin)..."
                  value={adminAuthorName}
                  onChange={(e) => setAdminAuthorName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold focus:outline-none"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Type internal note (e.g. 'Customer requested delivery after 5 PM')..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
              />

              <div className="text-right">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-lg text-xs shadow transition-all"
                >
                  Add Internal Note
                </button>
              </div>
            </form>

            {/* Internal Notes History List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {internalNotesList.map((note) => (
                <div key={note.id} className="bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800/50 pb-1">
                    <span className="font-bold text-amber-300">{note.adminName || 'Admin'}</span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {note.date} at {note.time}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-200 pt-1 font-sans">{note.noteText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6 & 7: PAYMENT & SHIPPING CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PAYMENT MANAGEMENT CARD */}
            <div className="bg-zinc-950 border border-amber-800/40 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="font-serif font-bold text-amber-100 text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>6. Payment Management</span>
                </h3>
                <button
                  onClick={() => setShowAddPaymentModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-2.5 py-1 rounded-lg font-extrabold text-[11px] shadow transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Record Payment
                </button>
              </div>

              {/* COD Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block uppercase font-semibold">COD Amount</span>
                  <span className="font-serif font-extrabold text-amber-200 text-xs">Rs. {codAmount.toLocaleString('en-PK')}</span>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                  <span className="text-[10px] text-emerald-300 block uppercase font-semibold">Collected</span>
                  <span className="font-serif font-extrabold text-emerald-400 text-xs">Rs. {amountCollected.toLocaleString('en-PK')}</span>
                </div>
                <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40">
                  <span className="text-[10px] text-amber-300 block uppercase font-semibold">Remaining</span>
                  <span className="font-serif font-extrabold text-amber-400 text-xs">Rs. {remainingAmount.toLocaleString('en-PK')}</span>
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-amber-200 font-bold block">Payment History:</span>
                <div className="border border-zinc-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-zinc-900 text-zinc-400 font-bold">
                      <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Method</th>
                        <th className="p-2">Txn ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {paymentHistory.map((p, i) => (
                        <tr key={p.id || i}>
                          <td className="p-2 font-mono text-zinc-400">{p.date}</td>
                          <td className="p-2 font-bold text-amber-300 font-mono">Rs. {Number(p.amount || 0).toLocaleString('en-PK')}</td>
                          <td className="p-2 text-zinc-200">{p.method}</td>
                          <td className="p-2 font-mono text-zinc-400">{p.transactionId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SHIPPING & FULFILLMENT CARD */}
            <div className="bg-zinc-950 border border-amber-800/40 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="font-serif font-bold text-amber-100 text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>7. Shipping & Fulfillment</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold block">Courier:</span>
                  <select
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-600/60 rounded p-1.5 text-amber-200 font-bold"
                  >
                    {courierOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold block">Tracking Number:</span>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-amber-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold block">Dispatch Date:</span>
                  <input
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold block">Expected Delivery:</span>
                  <input
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 11: ACTIVITY LOG & MODIFICATION HISTORY */}
          <div className="bg-zinc-950 border border-amber-800/30 p-4 rounded-2xl space-y-3">
            <h4 className="font-serif font-bold text-amber-200 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-800 pb-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Activity Log & Order Modification History</span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activityLog.map((act) => (
                <div key={act.id} className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80 flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-300">{act.action}</span>
                    <p className="text-zinc-300 text-[11px]">{act.details}</p>
                  </div>
                  <div className="text-right shrink-0 font-mono text-[10px] text-zinc-500">
                    <div>{act.timestamp}</div>
                    <div className="text-amber-400">{act.adminName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 8: PREDEFINED WHATSAPP TEMPLATES MODAL */}
      {showWaTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-amber-800/60 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Predefined Customer WhatsApp Messages</span>
              </h3>
              <button onClick={() => setShowWaTemplateModal(false)} className="text-zinc-400 hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Select Message Template:</label>
                <select
                  value={selectedWaTemplate}
                  onChange={(e) => setSelectedWaTemplate(e.target.value)}
                  className="w-full bg-zinc-950 border border-amber-600/60 rounded-lg p-2.5 text-amber-200 font-bold focus:outline-none"
                >
                  <option value="Order Confirmation">Order Confirmation</option>
                  <option value="Order Processing">Order Processing</option>
                  <option value="Order Ready to Ship">Order Ready to Ship</option>
                  <option value="Order Dispatched">Order Dispatched</option>
                  <option value="Order Out for Delivery">Order Out for Delivery</option>
                  <option value="Order Delivered">Order Delivered</option>
                  <option value="Order Cancelled">Order Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Message Preview:</label>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-emerald-300 font-sans whitespace-pre-wrap text-xs leading-relaxed max-h-48 overflow-y-auto">
                  {getWaMessage(selectedWaTemplate)}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowWaTemplateModal(false)}
                  className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl"
                >
                  Cancel
                </button>

                {formattedPhoneForWa ? (
                  <a
                    href={`https://wa.me/${formattedPhoneForWa}?text=${encodeURIComponent(getWaMessage(selectedWaTemplate))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowWaTemplateModal(false)}
                    className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-extrabold rounded-xl shadow text-center flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </a>
                ) : (
                  <button disabled className="w-1/2 py-2.5 bg-zinc-800 text-zinc-500 font-bold rounded-xl">
                    No Phone Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 12: CANCEL ORDER MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-red-800/60 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-red-300 text-base flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span>Cancel Order #{trackingNumber || order.trackingNumber}</span>
              </h3>
              <button onClick={() => setShowCancelModal(false)} className="text-zinc-400 hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Cancellation Reason:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-200 font-bold focus:outline-none"
                >
                  <option value="Customer Requested">Customer Requested</option>
                  <option value="Wrong Address">Wrong Address</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Customer Unreachable">Customer Unreachable</option>
                  <option value="Duplicate Order">Duplicate Order</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Cancellation Notes:</label>
                <textarea
                  rows={3}
                  value={cancelNotes}
                  onChange={(e) => setCancelNotes(e.target.value)}
                  placeholder="Additional details..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl shadow transition-all"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 12: RETURN & REFUND MODAL */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-blue-800/60 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-blue-300 text-base flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-400" />
                <span>Return & Refund System</span>
              </h3>
              <button onClick={() => setShowReturnModal(false)} className="text-zinc-400 hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Return Status:</label>
                <select
                  value={returnStatus}
                  onChange={(e) => setReturnStatus(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-200 font-bold focus:outline-none"
                >
                  <option value="Return Requested">Return Requested</option>
                  <option value="Return Approved">Return Approved</option>
                  <option value="Return in Transit">Return in Transit</option>
                  <option value="Returned">Returned</option>
                  <option value="Refund Pending">Refund Pending</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Return Reason:</label>
                <input
                  type="text"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Refund Amount (Rs.):</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-300 font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Refund Method:</label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-zinc-200 font-bold focus:outline-none"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Original Payment Method">Original Payment Method</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow transition-all"
                >
                  Save Return Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-amber-800/60 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>Record New Payment</span>
              </h3>
              <button onClick={() => setShowAddPaymentModal(false)} className="text-zinc-400 hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Payment Date</label>
                <input
                  type="date"
                  required
                  value={newPayDate}
                  onChange={(e) => setNewPayDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Amount (Rs.)</label>
                <input
                  type="number"
                  required
                  value={newPayAmount}
                  onChange={(e) => setNewPayAmount(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-300 font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Payment Method</label>
                <select
                  value={newPayMethod}
                  onChange={(e) => setNewPayMethod(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none"
                >
                  {paymentMethodsList.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Transaction ID / Reference</label>
                <input
                  type="text"
                  required
                  value={newPayTxnId}
                  onChange={(e) => setNewPayTxnId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-200 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Payment Status</label>
                <select
                  value={newPayStatus}
                  onChange={(e) => setNewPayStatus(e.target.value)}
                  className="w-full bg-zinc-950 border border-amber-600/60 rounded-lg p-2.5 text-amber-200 font-bold focus:outline-none"
                >
                  {paymentStatusList.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-xl shadow transition-all"
                >
                  Save Payment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
