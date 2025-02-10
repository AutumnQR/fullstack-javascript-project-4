test:
	NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npx jest

lint:
	npx eslint .
