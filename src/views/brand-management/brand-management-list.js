import React, { useEffect } from "react";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "./Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

// angular UI
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

// dialog
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// validation
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux/es/exports";

import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

import Box from "@mui/material/Box";
import { getAllDish } from "actions/dish";
import { getAllCategories } from "actions/category";
import * as api from "../../apis/product";
import { addDish } from "actions/dish";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function DishManagementPage() {
  // validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm();
  const onSubmit = async (data) => {
    const inputData = {
      dishName: data.dishName,
      dishDescription: data.description,
      dishCooking: data.dishCooking,
      addDishDetails: addDishDetails.map((dish) => {
        return {
          productId: dish.products.map((pro) => pro.id),
          quantity: dish.quantity,
          ingredient: dish.productName,
          unitName: dish.unitName,
        };
      }),
    };
    dispatch(addDish(inputData));
    handleClose();
  };
  const dispatch = useDispatch();
  const dishs = useSelector((state) => state.dish);
  const categories = useSelector((state) => state.category);
  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllDish());
  }, []);

  // dialog
  const [open, setOpen] = React.useState(false);

  // open dialog
  const handleClickOpen = () => {
    categories.push({ categoryId: 0, categoryName: "Chọn nguyên liệu" });
    setOpen(true);
  };

  // close dialog
  const handleClose = () => {
    resetField("dishName");
    resetField("description");
    resetField("dishCooking");
    setOpen(false);
  };

  const handleDelete = (data, index) => () => {
    const list = [...addDishDetails];
    list[index].products = list[index].products.filter(
      (pro) => pro.id !== data.id
    );
    setAddDishDetails(list);
  };
  const handleChangeCate = async (e, index) => {
    const res = await api.getAllProductByCategory(e.target.value);
    const list = [...addDishDetails];
    list[index].category = e.target.value;
    list[index].productsToSelect = res.data.map((p) => {
      return { id: p.productId, name: p.productName };
    });
    setAddDishDetails(list);
  };

  //const [chipData, setChipData] = React.useState([]);
  const [addDishDetails, setAddDishDetails] = React.useState([
    {
      category: 0,
      productsToSelect: [],
      products: [],
      productName: "",
      unitName: "",
      quantity: "",
    },
  ]);
  const handleAdd = () => {
    setAddDishDetails([
      ...addDishDetails,
      {
        category: 0,
        productsToSelect: [],
        products: [],
        productName: "",
        unitName: "",
        quantity: "",
      },
    ]);
  };
  const handleRemove = (index) => {
    const list = [...addDishDetails];
    list.splice(index, 1);
    setAddDishDetails(list);
  };
  const handleProductChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...addDishDetails];
    list[index][name] = value;
    setAddDishDetails(list);
  };
  const handleClick = (data, index) => {
    const list = [...addDishDetails];
    !list[index].products.some((pro) => pro.id === data.id) &&
      list[index].products.push(data);
    setAddDishDetails(list);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Stack direction="row" marginLeft="15px">
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleClickOpen}
          >
            <span>Thêm mới</span>
          </Button>
        </Stack>

        <Dialog
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit(onSubmit)}
          disableEscapeKeyDown={false}
          onBackdropClick="false"
        >
          <form>
            <DialogTitle>Thêm mới</DialogTitle>
            <DialogContent>
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                    fullWidth
                    margin="dense"
                    id="dishName"
                    label="Tên món ăn"
                    type="text"
                    name="dishName"
                    variant="outlined"
                    {...register("dishName", {
                      required: "Dish name is required.",
                    })}
                    error={!!errors.dishName}
                    helperText={errors.dishName?.message}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    margin="dense"
                    id="description"
                    label="Mô tả"
                    type="text"
                    name="description"
                    variant="outlined"
                    {...register("description", {
                      required: "Description is required.",
                    })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    margin="dense"
                    id="cook"
                    label="Cách nấu ăn"
                    type="text"
                    name="dishCooking"
                    variant="outlined"
                    {...register("dishCooking", {
                      required: "Dish cooking is required.",
                    })}
                    error={!!errors.dishCooking}
                    helperText={errors.dishCooking?.message}
                  />
                </div>
              </Box>

              {addDishDetails.map((dish, index) => (
                <div key={index}>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <h4>
                      <b>Nguyên liệu nấu ăn</b>
                    </h4>
                    <div>
                      {/* chon category */}
                      <TextField
                        fullWidth
                        id="outlined-select-currency"
                        select
                        label="Nguyên liệu"
                        onChange={(e) => handleChangeCate(e, index)}
                        value={dish.category}
                      >
                        {categories.map((option) => (
                          <MenuItem
                            key={option.categoryId}
                            value={option.categoryId}
                          >
                            {option.categoryName}
                          </MenuItem>
                        ))}
                      </TextField>

                      <Box sx={{ m: 2 }}>
                        <div>
                          <Paper
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              flexWrap: "wrap",
                              listStyle: "none",
                              p: 0.5,
                              m: 1,
                            }}
                            component="ul"
                            elevation={0}
                          >
                            {dish.productsToSelect.map((data) => {
                              return (
                                <ListItem key={data.id}>
                                  <Chip
                                    label={data.name}
                                    onClick={() => handleClick(data, index)}
                                  />
                                </ListItem>
                              );
                            })}
                          </Paper>
                        </div>
                        <div>
                          <Paper
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              flexWrap: "wrap",
                              listStyle: "none",
                              p: 0.5,
                              m: 1,
                            }}
                            component="ul"
                            variant="outlined"
                          >
                            {dish.products.map((data) => {
                              let icon;
                              return (
                                <ListItem key={data.id}>
                                  <Chip
                                    icon={icon}
                                    label={data.name}
                                    onDelete={
                                      data.name === "React"
                                        ? undefined
                                        : handleDelete(data, index)
                                    }
                                  />
                                </ListItem>
                              );
                            })}
                          </Paper>
                        </div>
                      </Box>
                    </div>
                  </Box>

                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        fullWidth
                        margin="dense"
                        id="productName"
                        label="Tên sản phẩm"
                        type="text"
                        name="productName"
                        variant="outlined"
                        value={dish.productName}
                        onChange={(e) => handleProductChange(e, index)}
                      />
                    </div>
                    <div>
                      <TextField
                        fullWidth
                        margin="dense"
                        id="quantity"
                        label="Số lượng"
                        type="text"
                        name="quantity"
                        variant="outlined"
                        value={dish.quantity}
                        onChange={(e) => handleProductChange(e, index)}
                      />
                    </div>
                    <div>
                      <TextField
                        fullWidth
                        margin="dense"
                        id="unitName"
                        label="Tên đơn vị"
                        type="text"
                        name="unitName"
                        variant="outlined"
                        value={dish.unitName}
                        onChange={(e) => handleProductChange(e, index)}
                      />
                    </div>
                  </Box>
                  <Button
                    startIcon={<AddCircleIcon />}
                    onClick={() => handleRemove(index)}
                  >
                    Xóa nguyên liệu
                  </Button>
                </div>
              ))}
              <div>
                <Button startIcon={<AddCircleIcon />} onClick={handleAdd}>
                  Thêm nguyên liệu
                </Button>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Hủy</Button>
              <Button type="submit">Lưu</Button>
            </DialogActions>
          </form>
        </Dialog>

        <Card>
          <CardHeader color="warning"></CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="warning"
              tableHead={["ID", "Tên món ăn", "Mô tả", "Cách nấu", ""]}
              tableData={dishs.map((dish) => {
                // console.log(brand);
                return [
                  dish.dishId,
                  dish.dishName,
                  dish.dishDescription,
                  dish.dishCooking,
                ];
              })}
              editData={dishs}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
