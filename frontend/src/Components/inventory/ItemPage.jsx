import React, { useState, useMemo, useEffect } from "react";
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
import api from "../../api";

const SquareImage = styled('img')({
  width: '50px',
  height: '50px',
  objectFit: 'cover',
  borderRadius: '4px',
});

const columnMap = [
  { key: "image", label: "IMAGE", align: "left" },
  { key: "name", label: "NAME", align: "left" },
  { key: "category", label: "CATEGORY", align: "left" },
  { key: "description", label: "DESCRIPTION", align: "left" },
  { key: "quantity", label: "QUANTITY", align: "right" },
  { key: "selling_price", label: "RATE", align: "right" },
];

function ItemPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);

  async function fetchData() {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get('/token/items/'),
        api.get('/token/categories/')
      ]);

      const categoryMap = {};
      categoriesRes.data.forEach(category => {
        categoryMap[category.id] = category.name;
      });
      setCategories(categoryMap);
      setCategoriesList(categoriesRes.data);

      const itemsWithCategoryNames = itemsRes.data.map(item => ({
        ...item,
        category: categoryMap[item.category] || '-'
      }));
      setItems(itemsWithCategoryNames);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [newItemModalOpen]);

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
    setItems([...items, { ...newItem, id: items.length + 1, image: "/api/placeholder/50/50", category: categories[newItem.category] || '-' }]);
    setNewItemModalOpen(false);
  };

  const handleItemUpdate = (updatedItem) => {
    const updatedItemWithCategoryName = {
      ...updatedItem,
      category: categories[updatedItem.category] || '-'
    };
    setItems(prevItems => prevItems.map(item => 
      item.item_id === updatedItemWithCategoryName.item_id ? updatedItemWithCategoryName : item
    ));
    setSelectedItem(updatedItemWithCategoryName);
  };

  return (
    <Box sx={{ p: 3, fontFamily: "ClashGrotesk-Medium" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<SortIcon />}
          sx={{ 
            background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
            color: '#232619',
            boxShadow:'none',
            '&:hover': {
              background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
              boxShadow:'none'
            },
            textTransform: 'none',
            fontWeight: 'semibold',
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
                borderRadius: "6px",
                backgroundColor: "#F3F4F6",
              },
            }}
          />
          <Button
            onClick={handleNewItemClick}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ 
              height:'100%',
              background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
              color: '#232619',
              boxShadow:'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
                boxShadow:'none'
              },
              textTransform: 'none',
              fontWeight: 'semibold',
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
              {columnMap.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
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
                {columnMap.map((column) => (
                  <TableCell key={column.key} align={column.align} sx={{ userSelect: "none" }}>
                    {column.key === "image" ? (
                      <SquareImage src={"http://127.0.0.1:8000"+item[column.key]} alt={item.name} />
                    ) : column.key === "selling_price" ? (
                      `₹ ${item[column.key]}`
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
        onClose={() => { setSelectedItem(null); fetchData(); }}
        item={selectedItem}
        onItemDeleted={(deletedItemId) => {
          setItems(prevItems => prevItems.filter(item => item.item_id !== deletedItemId));
          fetchData();
        }}
        onItemUpdated={handleItemUpdate}
        categories={categoriesList}
      />
      <NewItemModal
        open={newItemModalOpen}
        onClose={() => setNewItemModalOpen(false)}
        onSave={handleNewItemSave}
        categories={categoriesList}
      />
    </Box>
  );
}

export default ItemPage;