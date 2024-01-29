<script lang="ts">
	import { AlertCircle } from 'lucide-svelte'
	import * as Alert from '$lib/components/ui/alert'
</script>

<div>
	<Alert.Root class="mt-5" variant="destructive">
		<AlertCircle class="h-4 w-4" />
		<Alert.Title class="flex justify-center font-bold">Error</Alert.Title>
		<Alert.Description class="flex justify-center"
			>You are unauthorized to access this site. Please contact the Kusogaki team for more
			information.
		</Alert.Description>
	</Alert.Root>
</div>
<h1 class="mt-5 flex justify-center">
	Click <a class="ml-1 mr-1 text-[#0284c7]" href="/">here</a> to go back to home page.
</h1>
