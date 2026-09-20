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
       backgroundColor: "#111827",
        marginTop: "10px",
        maxWidth: "15%",
        width: "100%",
        height: "100vh",
        position: "fixed",
        borderRadius: "10px",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)", 
        padding: "10px",
        boxSizing: "border-box",
      }}
    >

        <List component="div" disablePadding>
        <ListItem disablePadding>
          <ListItemButton
            onClick={onShowProducts}
            sx={{
              borderRadius: "8px",
              mb: 1,
              color: "#94a3b8", 
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)", 
                color: "#2563eb", 
              },
            }}
          >
            <ListItemText 
              primary= {
                 <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: "inherit" }}>
                  Mis productos
                </Typography>
              } 
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={onAddProduct}
            sx={{
              borderRadius: "8px",
              color: "#94a3b8",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#2563eb",
              },
            }}
          >
            <ListItemText 
               primary={
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: "inherit" }}>
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
