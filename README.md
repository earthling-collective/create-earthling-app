# create-earthling-app cli

## Responsibilities of template creation
1. Remove hello world assets/stylings from base template
   1. public/*
   1. src/app/page.tsx stuff
1. install tailwind
   1. make sure postcss.config.mjs is there/working with the tailwind plugin
1. install shadcn / earthling-ui
   1. Move cn from lib/utils to utils/cn.tsx
   1. change fonts to css variables
1. add svg support
1. flex-col body and make window height (min-[100svh])
1. set up vars.tsx
1. set up store?
