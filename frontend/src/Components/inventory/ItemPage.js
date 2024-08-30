import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import SearchIcon from "@mui/icons-material/Search";
import ItemDetailView from "./ItemDetailView";
import NewItemModal from "./NewItemModal";

// Custom styled component for square images
const SquareImage = styled('img')({
  width: '50px',
  height: '50px',
  objectFit: 'cover',
  borderRadius: '4px',
});

const initialItemsData = [
  {
    id: 1,
    image: "https://picsum.photos/200",
    name: "Sofa",
    sku: "Item 1 sku",
    type: "Goods",
    description: "A comfortable, modern sofa with plush cushions.",
    rate: "Rs.731.00",
    hsnCode: "812562",
    unit: "Pcs",
    upc: "Item 1 upc",
    ean: "Item 1 ean",
    isbn: "Item 1 isbn",
    createdSource: "User",
    salesAccount: "Advertising And Marketing",
  },
  // Add more items as needed
];

const columnMap = [
  { key: "image", label: "IMAGE" },
  { key: "name", label: "NAME" },
  { key: "sku", label: "SKU" },
  { key: "type", label: "TYPE" },
  { key: "description", label: "DESCRIPTION" },
  { key: "rate", label: "RATE" },
];

function ItemPage() {
  const [items, setItems] = useState(initialItemsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleNewItemClick = () => {
    setNewItemModalOpen(true);
  };

  const handleNewItemSave = (newItem) => {
    setItems([...items, { ...newItem, id: items.length + 1, image: "/api/placeholder/50/50" }]);
    setNewItemModalOpen(false);
  };

  return (
    <Box sx={{ p: 3, fontFamily: "ClashGrotesk-Medium" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          startIcon={<SortIcon />}
          variant="contained"
          sx={{
            backgroundColor: "#D9F99D",
            color: "#232619",
            "&:hover": { backgroundColor: "#BEF264" },
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Sort
        </Button>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search item"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "300px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#F3F4F6",
              },
            }}
          />
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleNewItemClick}
            sx={{
              backgroundColor: "#D9F99D",
              color: "#232619",
              "&:hover": { backgroundColor: "#BEF264" },
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            New Item
          </Button>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", border: "1px solid #E5E7EB" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              {columnMap.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{ fontWeight: "bold", userSelect: "none" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#F3F4F6" },
                }}
                onClick={() => handleItemClick(item)}
              >
                <TableCell padding="checkbox">
                  <Checkbox onClick={(e) => e.stopPropagation()} />
                </TableCell>
                {columnMap.map((column) => (
                  <TableCell key={column.key} sx={{ userSelect: "none" }}>
                    {column.key === "image" ? (
                      <SquareImage src={item[column.key]} alt={item.name} />
                    ) : (
                      item[column.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ItemDetailView
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
      <NewItemModal
        open={newItemModalOpen}
        onClose={() => setNewItemModalOpen(false)}
        onSave={handleNewItemSave}
      />
    </Box>
  );
}

export default ItemPage;