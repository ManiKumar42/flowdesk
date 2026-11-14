# Design explanation

1. I invented FlowDesk, a calm project-management tool, so the copy could be consistent and specific.
2. A warm off-white background, dark ink text and one violet accent with a lime highlight keep the hierarchy clear.
3. Bricolage Grotesque for headings and Inter for body text give strong contrast and good readability.
4. The hero visual is a live kanban board built in HTML/CSS/JS: clicking a card moves it, which shows interactivity.
5. All colours, radii and shadows are CSS variables, so the theme can be changed in one place.
6. Layout uses CSS Grid and Flexbox; one 900px and one 640px breakpoint collapse columns and switch to a hamburger menu.
7. Forms use JavaScript validation with inline errors and success states. A shake animation signals an invalid hero email.
8. Challenge solved: animated FAQ height without fixed pixel values, using `grid-template-rows: 0fr → 1fr`.
