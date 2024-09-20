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
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ClearIcon from "@mui/icons-material/Clear";
import ItemDetailView from "./ItemDetailView";
import NewItemModal from "./NewItemModal";
import api from "../../api";
import NoProductListImage from '../../assets/Noproduct_itemlist.png';
import { BorderColor } from "@mui/icons-material";

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

const ITEMS_PER_PAGE = 10;

function ItemPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [page, setPage] = useState(1);

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

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortFieldSelect = (field) => {
    setSortField(field);
    setSortOrder('asc');
    handleSortClose();
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleClearSort = () => {
    setSortField(null);
    setSortOrder(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const sortedAndFilteredItems = useMemo(() => {
    let result = items.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );

    if (sortField && sortOrder) {
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [items, searchTerm, sortField, sortOrder]);

  const paginatedItems = sortedAndFilteredItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const pageCount = Math.ceil(sortedAndFilteredItems.length / ITEMS_PER_PAGE);

  const buttonStyle = {
    background: 'linear-gradient(90deg, #D1EA67 , #A6F15A )',
    color: '#232619',
    boxShadow: 'none',
    '&:hover': {
      background: 'linear-gradient(90deg, #C1DA57 , #96E14A )',
      boxShadow: 'none'
    },
    textTransform: 'none',
    fontWeight: 'semibold',
  };

  const greyButtonStyle = {
    border:'2px solid #DEDEDE',
    color: '#AEAEAE',
    boxShadow: 'none',
    backgroundColor:'#FFFFFF',
    '&:hover': {
      border:'2px solid #616161',
    color: '#616161',
    backgroundColor:'#FFFFFF',
    boxShadow:'none',
    },
    textTransform: 'none',
    fontWeight: 'semibold',
  };

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
    <Box sx={{ p: 3, fontFamily: "ClashGrotesk-Medium", color: "#232619" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SortIcon />}
            onClick={handleSortClick}
            sx={buttonStyle}
          >
            Sort
          </Button>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortClose}
          >
            <MenuItem onClick={() => handleSortFieldSelect('name')}>Name</MenuItem>
            <MenuItem onClick={() => handleSortFieldSelect('quantity')}>Quantity</MenuItem>
            <MenuItem onClick={() => handleSortFieldSelect('selling_price')}>Rate</MenuItem>
          </Menu>
          {sortField && (
            <Button
              variant="contained"
              onClick={handleSortOrderToggle}
              startIcon={sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              sx={greyButtonStyle}
            >
              {`${sortField} (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
            </Button>
          )}
          {(sortField || sortOrder) && (
            <Button
              variant="contained"
              onClick={handleClearSort}
              startIcon={<ClearIcon />}
              sx={greyButtonStyle}
            >
              Clear
            </Button>
          )}
        </Box>
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
            sx={buttonStyle}
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
            {paginatedItems.map((item) => (
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
                      <SquareImage 
                        src={item[column.key] ? `http://127.0.0.1:8000${item[column.key]}` : NoProductListImage} 
                        alt={item.name} 
                      />
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2">
          Page {page} of {pageCount}
        </Typography>
        <Pagination 
          count={pageCount} 
          page={page} 
          onChange={handleChangePage}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#232619',
            },
            '& .Mui-selected': {
              backgroundColor: '#D1EA67 !important',
            },
          }}
        />
      </Box>
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