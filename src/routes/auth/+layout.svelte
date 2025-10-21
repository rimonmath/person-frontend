<script>
	let { children } = $props();
</script>

<div class="login-container">
	<div class="login-box">
		{@render children()}
	</div>
</div>

<style>
	.login-container {
		background: linear-gradient(to bottom right, #e5d0a1, #56c9c9);
		padding: 40px 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
	.login-box {
		background: white;
		padding: 40px;
		border-radius: 10px;
		width: 400px;
	}
</style>
