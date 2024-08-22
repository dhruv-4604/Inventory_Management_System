import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    number: '1',
    fromName: '',
    toName: '',
    shipTo: '',
    date: '',
    paymentTerms: '',
    dueDate: '',
    poNumber: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: '',
    terms: '',
    tax: 0,
    discount: 0,
    shipping: 0,
    amountPaid: 0,
  });

  const [currency, setCurrency] = useState('USD ($)');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, rate: 0, amount: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * invoiceData.tax) / 100;
    return subtotal + taxAmount - invoiceData.discount + invoiceData.shipping;
  };

  const calculateBalanceDue = () => {
    return calculateTotal() - invoiceData.amountPaid;
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    
    // Add company logo
    // doc.addImage(logoDataUrl, 'PNG', 10, 10, 40, 40);

    // Add invoice title
    doc.setFontSize(20);
    doc.text('INVOICE', 150, 20, { align: 'right' });

    // Add invoice number
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoiceData.number}`, 150, 30, { align: 'right' });

    // Add from address
    doc.setFontSize(12);
    doc.text('From:', 10, 50);
    doc.setFontSize(10);
    doc.text(invoiceData.fromName, 10, 60);

    // Add to address
    doc.setFontSize(12);
    doc.text('Bill To:', 10, 80);
    doc.setFontSize(10);
    doc.text(invoiceData.toName, 10, 90);

    // Add invoice details
    doc.setFontSize(10);
    doc.text(`Date: ${invoiceData.date}`, 150, 50, { align: 'right' });
    doc.text(`Payment Terms: ${invoiceData.paymentTerms}`, 150, 60, { align: 'right' });
    doc.text(`Due Date: ${invoiceData.dueDate}`, 150, 70, { align: 'right' });
    doc.text(`PO Number: ${invoiceData.poNumber}`, 150, 80, { align: 'right' });

    // Add table for items
    doc.autoTable({
      startY: 100,
      head: [['Item', 'Quantity', 'Rate', 'Amount']],
      body: invoiceData.items.map(item => [
        item.description,
        item.quantity.toString(),
        item.rate.toFixed(2),
        item.amount.toFixed(2)
      ]),
      foot: [
        ['Subtotal', '', '', calculateSubtotal().toFixed(2)],
        ['Tax', '', `${invoiceData.tax}%`, (calculateSubtotal() * invoiceData.tax / 100).toFixed(2)],
        ['Total', '', '', calculateTotal().toFixed(2)],
        ['Amount Paid', '', '', invoiceData.amountPaid.toFixed(2)],
        ['Balance Due', '', '', calculateBalanceDue().toFixed(2)]
      ],
      theme: 'striped',
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    });

    // Add notes
    const finalY = doc.lastAutoTable.finalY || 100;
    doc.setFontSize(12);
    doc.text('Notes:', 10, finalY + 20);
    doc.setFontSize(10);
    doc.text(invoiceData.notes, 10, finalY + 30);

    // Add terms
    doc.setFontSize(12);
    doc.text('Terms:', 10, finalY + 60);
    doc.setFontSize(10);
    doc.text(invoiceData.terms, 10, finalY + 70);

    // Save the PDF
    doc.save(`invoice_${invoiceData.number}.pdf`);
  };

  return (
    <Container maxWidth="md" id="invoice-container">
      <Box my={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box border={1} borderColor="grey.300" height={100} display="flex" alignItems="center" justifyContent="center">
              <Typography variant="body2" color="textSecondary">
                + Add Your Logo
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" align="right" gutterBottom>
              INVOICE
            </Typography>
            <TextField
              fullWidth
              label="#"
              name="number"
              value={invoiceData.number}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Who is this from?"
              name="fromName"
              value={invoiceData.fromName}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={invoiceData.date}
              onChange={handleInputChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Payment Terms"
              name="paymentTerms"
              value={invoiceData.paymentTerms}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Due Date"
              name="dueDate"
              type="date"
              value={invoiceData.dueDate}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="PO Number"
              name="poNumber"
              value={invoiceData.poNumber}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bill To"
              name="toName"
              value={invoiceData.toName}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ship To (optional)"
              name="shipTo"
              value={invoiceData.shipTo}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Rate</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Description of item/service..."
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                  <TableCell align="right">{item.amount.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => removeItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button startIcon={<AddIcon />} onClick={addItem} sx={{ mt: 2 }}>
          Line Item
        </Button>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={invoiceData.notes}
              onChange={handleInputChange}
              variant="outlined"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Terms"
              name="terms"
              value={invoiceData.terms}
              onChange={handleInputChange}
              variant="outlined"
              multiline
              rows={4}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Subtotal: {calculateSubtotal().toFixed(2)}</Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <TextField
                label="Tax"
                name="tax"
                type="number"
                value={invoiceData.tax}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                inputProps={{ min: 0, step: 0.1 }}
              />
              <Typography variant="body1" sx={{ ml: 1 }}>
                %
              </Typography>
              <IconButton size="small">
                <RefreshIcon />
              </IconButton>
            </Box>
            <Button startIcon={<AddIcon />} sx={{ mt: 2 }}>
              Discount
            </Button>
            <Button startIcon={<AddIcon />} sx={{ mt: 2, ml: 2 }}>
              Shipping
            </Button>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: {calculateTotal().toFixed(2)}
            </Typography>
            <TextField
              fullWidth
              label="Amount Paid"
              name="amountPaid"
              type="number"
              value={invoiceData.amountPaid}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Balance Due: {calculateBalanceDue().toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={downloadPdf}>
          Download
        </Button>
        <Box>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            size="small"
          >
            <MenuItem value="USD ($)">USD ($)</MenuItem>
            <MenuItem value="EUR (€)">EUR (€)</MenuItem>
            <MenuItem value="GBP (£)">GBP (£)</MenuItem>
          </Select>
          <Button sx={{ ml: 2 }}>Save Default</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default InvoiceGenerator;