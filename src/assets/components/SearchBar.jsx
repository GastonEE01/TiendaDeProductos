import { useRef } from 'react'

export const SearchBar = ({onFilterChange,onSearchChange}) => {
  const inputRef = useRef(null)

    return (
    
    <div>
        <input type="text" placeholder='Buscar productos...' onChange={onSearchChange} ref={inputRef} />
        <button onClick = {() => inputRef.current.focus()}>Buscar</button>
        <label htmlfor="productos">Elige un producto:</label>
<select name="productos" id="productos" onChange={onFilterChange }>
    <option value="Todos">Todos</option>
  <option value="Tecnologia">Tecnologia</option>
  <option value="Ropa">Ropa</option>
  <option value="Accesorios">Accesorios</option>
</select>

        
    </div>
  )
}

