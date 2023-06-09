//Date

export function formatDate(dateString, format = 'default') {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now - date;
	const seconds = Math.floor(diffInMs / 1000);
	const minutes = Math.floor(diffInMs / (1000 * 60));
	const hours = Math.floor(diffInMs / (1000 * 60 * 60));
	const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	// Check if a specific format is defined for the route
	const routeOptions = {
		// Example: Route A
		reviewDate: {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: false
		},
		// Example: Route B
		anotherRouteFormat: {
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		}
		// Add more route-specific formats as needed
	};

	if (format in routeOptions) {
		const options = routeOptions[format];
		return date.toLocaleString('en-US', options);
	}

	if (seconds < 60) {
		return `${seconds} seconds ago`;
	} else if (minutes < 60) {
		return `${minutes} minutes ago`;
	} else if (hours < 24) {
		return `${hours} hours ago`;
	} else if (days === 1) {
		// If the date is yesterday, show "Yesterday" and the time
		const options = { hour: 'numeric', minute: 'numeric', hour12: true };
		return 'Yesterday, ' + date.toLocaleString('en-US', options);
	} else {
		// For older dates, show the full date and time
		const defaultOptions = {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		};
		return date.toLocaleString('en-US', defaultOptions);
	}
}
