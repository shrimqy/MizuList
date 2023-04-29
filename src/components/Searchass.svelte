<script>
    import SearchBar from './SearchBar.svelte';
  
    const handleSearch = (items) => {
      console.log(items);
    };
  </script>
  
  <SearchBar onSubmit={handleSearch} />
  