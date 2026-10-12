import { Box, List, ListItem, ListItemButton, ListItemText,Typography  } from "@mui/material";
interface ProductHeaderProps {
  onShowProducts: () => void;
  onAddProduct: () => void;
}


export const ProductHeader = ({
  onShowProducts,
  onAddProduct,
}: ProductHeaderProps) => {
  
  
    return (
       <Box
      component="nav"
      sx={{
        backgroundColor: "#172033",
        mt: { xs: 0, md: "10px" },
        maxWidth: { xs: "100%", md: "15%" },
        width: { xs: "100%", md: "15%" },
        height: { xs: "auto", md: "calc(100vh - 90px)" },
        position: { xs: "relative", md: "fixed" },
        top: { md: "90px" },
        left: 0,
        zIndex: { xs: 1, md: 1100 },
        borderRadius: { xs: 0, md: "10px" },
        borderRight: "1px solid rgba(255, 255, 255, 0.08)", 
        padding: "10px",
        boxSizing: "border-box",
      }}
    >

        <List
          component="div"
          disablePadding
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            gap: { xs: 0.5, md: 0 },
          }}
        >
        <ListItem disablePadding sx={{ flex: { xs: 1, md: "initial" }, minWidth: 0 }}>
          <ListItemButton
            onClick={onShowProducts}
            sx={{
              justifyContent: "center",
              borderRadius: "8px",
              mb: 1,
              color: "#FFFFFF",
              px: { xs: 1, md: 2 },
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)", 
                color: "#00E5FF",
              },
            }}
          >
            <ListItemText 
              primary= {
                 <Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.95rem" }, fontWeight: 700, fontFamily: "inherit", textAlign: { xs: "center", md: "left" } }}>
                  Mis productos
                </Typography>
              } 
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ flex: { xs: 1, md: "initial" }, minWidth: 0 }}>
          <ListItemButton
            onClick={onAddProduct}
            sx={{
              justifyContent: "center",
              borderRadius: "8px",
              color: "#FFFFFF",
              px: { xs: 1, md: 2 },
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#00E5FF",
              },
            }}
          >
            <ListItemText 
               primary={
                <Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.95rem" }, fontWeight: 700, fontFamily: "inherit", textAlign: { xs: "center", md: "left" } }}>
                  Agregar producto
                </Typography>
              } 
            />
          </ListItemButton>
        </ListItem>

      </List>
    </Box>
  );
};
