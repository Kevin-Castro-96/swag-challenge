import { useState, useEffect } from 'react';
import "./Cotizacion.css";

const QuotationPage = () => {
  // Datos de ejemplo del producto (normalmente vendrían de props o context)
  const productData = {
    product: {
      id: 1,
      name: "Camiseta Premium",
      sku: "CAM-001",
      price: 299,
      stock: 50
    },
    selectedColor: "Azul",
    selectedSize: "M",
    quantity: 1
  };
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    rfc: '',
    businessType: 'empresa',
    requestedQuantity: productData.quantity || 1
  });

  const [discounts, setDiscounts] = useState({
    quantityDiscount: 0,
    businessDiscount: 0,
    loyaltyDiscount: 0
  });

  const [finalPrice, setFinalPrice] = useState(0);
  const [errors, setErrors] = useState({});

  // Calcular descuentos y precio final
  useEffect(() => {
    if (!productData.product) return;

    const basePrice = productData.product.price * formData.requestedQuantity;
    let totalDiscount = 0;

    // Descuento por cantidad
    let quantityDiscount = 0;
    if (formData.requestedQuantity >= 100) {
      quantityDiscount = 15;
    } else if (formData.requestedQuantity >= 50) {
      quantityDiscount = 10;
    } else if (formData.requestedQuantity >= 20) {
      quantityDiscount = 5;
    }

    // Descuento por tipo de negocio
    let businessDiscount = 0;
    if (formData.businessType === 'distribuidor') {
      businessDiscount = 20;
    } else if (formData.businessType === 'mayorista') {
      businessDiscount = 15;
    } else if (formData.businessType === 'empresa') {
      businessDiscount = 5;
    }

    // Descuento adicional (ejemplo: cliente frecuente)
    const loyaltyDiscount = 2;

    totalDiscount = quantityDiscount + businessDiscount + loyaltyDiscount;
    const discountAmount = (basePrice * totalDiscount) / 100;
    const final = basePrice - discountAmount;

    setDiscounts({
      quantityDiscount,
      businessDiscount,
      loyaltyDiscount
    });
    setFinalPrice(final);
  }, [formData.requestedQuantity, formData.businessType, productData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = 'Nombre de empresa requerido';
    if (!formData.contactName.trim()) newErrors.contactName = 'Nombre de contacto requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'Email requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (formData.requestedQuantity < 1) newErrors.requestedQuantity = 'Cantidad debe ser mayor a 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateQuotationSummary = () => {
    if (!productData.product) return null;

    const basePrice = productData.product.price * formData.requestedQuantity;
    const totalDiscountPercent = discounts.quantityDiscount + discounts.businessDiscount + discounts.loyaltyDiscount;
    const discountAmount = (basePrice * totalDiscountPercent) / 100;

    return {
      // Datos de la empresa
      company: {
        name: formData.companyName,
        contact: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        rfc: formData.rfc,
        businessType: formData.businessType
      },
      // Datos del producto
      product: {
        name: productData.product.name,
        sku: productData.product.sku,
        selectedColor: productData.selectedColor,
        selectedSize: productData.selectedSize,
        unitPrice: productData.product.price,
        quantity: formData.requestedQuantity
      },
      // Cálculos
      pricing: {
        subtotal: basePrice,
        discounts: {
          quantity: `${discounts.quantityDiscount}%`,
          business: `${discounts.businessDiscount}%`,
          loyalty: `${discounts.loyaltyDiscount}%`,
          total: `${totalDiscountPercent}%`
        },
        discountAmount: discountAmount,
        finalPrice: finalPrice,
        tax: finalPrice * 0.16, // IVA 16%
        total: finalPrice * 1.16
      },
      // Metadatos
      quotationNumber: `COT-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES'),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')
    };
  };

  const exportToPDF = () => {
    const summary = generateQuotationSummary();
    
    // Crear contenido para exportar
    const content = `
COTIZACIÓN - ${summary.quotationNumber}
Fecha: ${summary.date}
Válida hasta: ${summary.validUntil}

DATOS DE LA EMPRESA:
Empresa: ${summary.company.name}
Contacto: ${summary.company.contact}
Email: ${summary.company.email}
Teléfono: ${summary.company.phone}
Dirección: ${summary.company.address}
Ciudad: ${summary.company.city}
País: ${summary.company.country}
RFC: ${summary.company.rfc}
Tipo de negocio: ${summary.company.businessType}

PRODUCTO COTIZADO:
Producto: ${summary.product.name}
SKU: ${summary.product.sku}
Color: ${summary.product.selectedColor}
Talla: ${summary.product.selectedSize}
Precio unitario: $${summary.product.unitPrice.toLocaleString('es-MX')}
Cantidad: ${summary.product.quantity}

RESUMEN DE PRECIOS:
Subtotal: $${summary.pricing.subtotal.toLocaleString('es-MX')}
Descuento por cantidad (${summary.pricing.discounts.quantity}): -$${(summary.pricing.subtotal * discounts.quantityDiscount / 100).toLocaleString('es-MX')}
Descuento comercial (${summary.pricing.discounts.business}): -$${(summary.pricing.subtotal * discounts.businessDiscount / 100).toLocaleString('es-MX')}
Descuento fidelidad (${summary.pricing.discounts.loyalty}): -$${(summary.pricing.subtotal * discounts.loyaltyDiscount / 100).toLocaleString('es-MX')}
Total descuentos: -$${summary.pricing.discountAmount.toLocaleString('es-MX')}
Subtotal con descuento: $${summary.pricing.finalPrice.toLocaleString('es-MX')}
IVA (16%): $${summary.pricing.tax.toLocaleString('es-MX')}
TOTAL: $${summary.pricing.total.toLocaleString('es-MX')}
    `.trim();

    // Crear y descargar archivo
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizacion-${summary.quotationNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const exportToJSON = () => {
    const summary = generateQuotationSummary();
    const blob = new Blob([JSON.stringify(summary, null, 2)], { 
      type: 'application/json;charset=utf-8' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizacion-${summary.quotationNumber}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Cotización generada exitosamente. Use los botones de exportar para descargar.');
    }
  };

  if (!productData.product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">
            No se encontraron datos del producto para cotizar.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const basePrice = productData.product.price * formData.requestedQuantity;
  const totalDiscountPercent = discounts.quantityDiscount + discounts.businessDiscount + discounts.loyaltyDiscount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Solicitar Cotización</h1>
              <p className="text-gray-600 mt-2">
                Complete el formulario para recibir una cotización personalizada
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="text-xl">←</span>
              Volver
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Datos de la Empresa</h2>
            
            <div onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese el nombre de la empresa"
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persona de Contacto *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contactName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del contacto"
                  />
                  {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contacto@empresa.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+54 11 1234-5678"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dirección completa"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ciudad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="País"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RFC/CUIT
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="RFC o CUIT"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Negocio
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="empresa">Empresa</option>
                    <option value="mayorista">Mayorista</option>
                    <option value="distribuidor">Distribuidor</option>
                    <option value="particular">Particular</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad Solicitada *
                  </label>
                  <input
                    type="number"
                    name="requestedQuantity"
                    value={formData.requestedQuantity}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.requestedQuantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.requestedQuantity && <p className="text-red-500 text-sm mt-1">{errors.requestedQuantity}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Generar Cotización
              </button>
            </div>
          </div>

          {/* Resumen y Cálculos */}
          <div className="space-y-6">
            {/* Producto */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Producto a Cotizar</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Producto:</span>
                  <span className="font-medium">{productData.product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-mono">{productData.product.sku}</span>
                </div>
                {productData.selectedColor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span>{productData.selectedColor}</span>
                  </div>
                )}
                {productData.selectedSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Talla:</span>
                    <span>{productData.selectedSize}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio unitario:</span>
                  <span className="font-medium">${productData.product.price.toLocaleString('es-MX')}</span>
                </div>
              </div>
            </div>

            {/* Cálculo de Precios */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Cálculo de Precios</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({formData.requestedQuantity} unidades):</span>
                  <span>${basePrice.toLocaleString('es-MX')}</span>
                </div>
                
                {/* Descuentos */}
                <div className="border-t pt-3">
                  <h4 className="font-medium text-gray-700 mb-2">Descuentos aplicables:</h4>
                  
                  {discounts.quantityDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>• Por cantidad ({discounts.quantityDiscount}%):</span>
                      <span>-${(basePrice * discounts.quantityDiscount / 100).toLocaleString('es-MX')}</span>
                    </div>
                  )}
                  
                  {discounts.businessDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>• Comercial ({discounts.businessDiscount}%):</span>
                      <span>-${(basePrice * discounts.businessDiscount / 100).toLocaleString('es-MX')}</span>
                    </div>
                  )}
                  
                  {discounts.loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>• Fidelidad ({discounts.loyaltyDiscount}%):</span>
                      <span>-${(basePrice * discounts.loyaltyDiscount / 100).toLocaleString('es-MX')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-medium text-green-600 pt-2 border-t">
                    <span>Total descuentos ({totalDiscountPercent}%):</span>
                    <span>-${((basePrice * totalDiscountPercent) / 100).toLocaleString('es-MX')}</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Subtotal con descuento:</span>
                    <span>${finalPrice.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA (16%):</span>
                    <span>${(finalPrice * 0.16).toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-blue-600 pt-2 border-t">
                    <span>TOTAL:</span>
                    <span>${(finalPrice * 1.16).toLocaleString('es-MX')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Niveles de descuento */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">💡 Niveles de descuento por cantidad:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• 20+ unidades: 5% descuento</div>
                <div>• 50+ unidades: 10% descuento</div>
                <div>• 100+ unidades: 15% descuento</div>
              </div>
            </div>

            {/* Botones de exportar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Exportar Cotización</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={exportToPDF}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <span>📄</span>
                  Exportar como TXT
                </button>
                <button
                  onClick={exportToJSON}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>📊</span>
                  Exportar como JSON
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                La cotización será válida por 30 días a partir de la fecha de generación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPage;