import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import jsPDF from "jspdf";
import "./Cotizacion.css";

const QuotationPage = () => {
  const location = useLocation();
  const { product, quantity, selectedColor, selectedSize } = location.state || {};

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (!product) {
    return (
      <div className="container">
        <h2>No se encontró ningún producto para cotizar</h2>
        <Link to="/" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    );
  }

  const getPriceForQty = (qty: number) => {
    const breakFound = [...product.priceBreaks]
      .sort((a, b) => b.minQty - a.minQty)
      .find((pb) => qty >= pb.minQty);
    return breakFound ? breakFound.price : product.basePrice;
  };

  const unitPrice = getPriceForQty(quantity);
  const totalPrice = unitPrice * quantity;

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Cotización", 10, 10);

    doc.setFontSize(12);
    doc.text(`Empresa: ${companyName}`, 10, 20);
    doc.text(`Contacto: ${contactName}`, 10, 28);
    doc.text(`Email: ${email}`, 10, 36);
    doc.text(`Teléfono: ${phone}`, 10, 44);

    doc.text("Producto cotizado:", 10, 60);
    doc.text(`- Nombre: ${product.name}`, 12, 68);
    doc.text(`- SKU: ${product.sku}`, 12, 76);
    if (selectedColor) doc.text(`- Color: ${selectedColor}`, 12, 84);
    if (selectedSize) doc.text(`- Talla: ${selectedSize}`, 12, 92);
    doc.text(`- Cantidad: ${quantity}`, 12, 100);
    doc.text(`- Precio unitario: $${unitPrice}`, 12, 108);
    doc.text(`- Total: $${totalPrice}`, 12, 116);

    doc.save(`cotizacion_${product.sku}.pdf`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePDF();
  };

  return (
    <div className="cotizacion-page">
      <h1 className="h2">Simulador de Cotización</h1>

      {/* Datos del producto */}
      <div className="quote-product">
        <h2 className="h3">{product.name}</h2>
        <p><strong>SKU:</strong> {product.sku}</p>
        {selectedColor && <p><strong>Color:</strong> {selectedColor}</p>}
        {selectedSize && <p><strong>Talla:</strong> {selectedSize}</p>}
        <p><strong>Cantidad:</strong> {quantity}</p>
        <p><strong>Precio unitario:</strong> ${unitPrice}</p>
        <h3>Total: ${totalPrice}</h3>
      </div>

      {/* Formulario */}
      <form className="quote-form" onSubmit={handleSubmit}>
        <h2 className="h3">Datos de la empresa</h2>

        <label>
          Nombre de empresa
          <input 
            type="text" 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)} 
            required 
          />
        </label>

        <label>
          Persona de contacto
          <input 
            type="text" 
            value={contactName} 
            onChange={(e) => setContactName(e.target.value)} 
            required 
          />
        </label>

        <label>
          Correo electrónico
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </label>

        <label>
          Teléfono
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </label>

        <button type="submit" className="btn btn-primary cta1">
          Generar PDF de cotización
        </button>
      </form>
    </div>
  );
};

export default QuotationPage;
