<script>
    import { goto } from '$app/navigation';
    
    function submitSearch(event) {
      event.preventDefault();
      const form = event.target;
      const input = form.querySelector('input[name="search-input"]');
      const searchValue = input.value;
      goto(`/search/${searchValue}`);
      console.log(searchValue);
    }
  </script>
  
  <form on:submit={submitSearch} class="search">
    <label for="search-input">Search</label>
    <input type="text" name="search-input"/>
    <button>Search</button>
  </form>
  