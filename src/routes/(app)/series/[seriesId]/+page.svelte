<script>
    /** @type {import('./$types').PageData} */
    export let data;
    console.log(data.series);
    let series = data.series
</script>

<title>{series.name}</title>

<div class="container">
	<h1>{series.name}</h1>
</div>

<style>
    * {
		margin: 0px;
		padding: 0px;
		font-family: 'Overpass', sans-serif;
        text-decoration: none;
	}

	:root {
		background-color: #edf1f5;
	}

	.container {
		padding: 2rem;
		max-width: 65%; 
		margin: 0 auto; 
	}

    h1 {
        color: #5e5e5e;
    }

	h3 {
		font-size: 16px;
		font-weight: 600;
		color: #5e5e5e;
		padding-bottom: 1rem;
	}
</style>