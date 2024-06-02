=====

- [X] # install sveltekit [frontend]

```sh
cd {APP_ROOT}
npm create svelte@latest frontend
```

"""
◇  Which Svelte app template?
│  Skeleton project
│
◇  Add type checking with TypeScript?
│  Yes, using TypeScript syntax
│
◇  Select additional options (use arrow keys/space bar)
│  Add ESLint for code linting, Add Prettier for code formatting
│
└  Your project is ready!

Next steps:
  1: cd frontend
  2: npm install
  4: npm run dev -- --open
"""

=====

- [X] # install project(macOS)

- [X] ## 환경 변수 설정(macOS)
> ~/.zshrc
```
export KMC_APP_ROOT="/Users/youchan/Dev/Jnj-soft/Projects/external/kmc-web-app-svelte"
```

```sh
source ~/.zshrc
```

- [X] ## create project
```sh
# github
cd /Users/youchan/Dev/Jnj-soft/Projects/external
# create remote repository & git clone
github -u jnjsoftko -n kmc-web-app-svelte -e initRepo
cd kmc-web-app-svelte
```

- [X] ## git branch

```sh
cd /Users/youchan/Dev/Jnj-soft/Projects/external/kmc-web-app-svelte

# git branch dev(개발)
git branch dev
git checkout dev
```

- [X] ### edit files
> `.gitignore`
> `.env`
> _docs/devTodos.md
