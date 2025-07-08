# Complete Bootstrap Cheat Sheet

## Table of Contents
1. [Setup](#setup)
2. [Grid System](#grid-system)
3. [Containers](#containers)
4. [Typography](#typography)
5. [Colors](#colors)
6. [Font Families](#font-families)
7. [Buttons](#buttons)
8. [Cards](#cards)
9. [Forms](#forms)
10. [Navbar](#navbar)
11. [Modals](#modals)
12. [Alerts](#alerts)
13. [Carousel](#carousel)
14. [Jumbotron](#jumbotron)
15. [Utilities](#utilities)
16. [Advanced CSS Concepts](#advanced-css-concepts)

---

## Setup

### CDN Links (Bootstrap 5)
```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- JavaScript Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### NPM Installation
```bash
npm install bootstrap
```

### Basic HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Page</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <!-- Your content here -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## Grid System

### Breakpoints
- `xs` - Extra small devices (< 576px)
- `sm` - Small devices (≥ 576px)
- `md` - Medium devices (≥ 768px)
- `lg` - Large devices (≥ 992px)
- `xl` - Extra large devices (≥ 1200px)
- `xxl` - Extra extra large devices (≥ 1400px)

### Basic Grid Structure
```html
<div class="container">
    <div class="row">
        <div class="col-12 col-md-6 col-lg-4">Column 1</div>
        <div class="col-12 col-md-6 col-lg-4">Column 2</div>
        <div class="col-12 col-md-12 col-lg-4">Column 3</div>
    </div>
</div>
```

### Grid Classes
- `.col` - Equal width columns
- `.col-{breakpoint}` - Equal width at breakpoint
- `.col-{number}` - Specific width (1-12)
- `.col-{breakpoint}-{number}` - Specific width at breakpoint
- `.col-auto` - Natural width of content

### Grid Examples
```html
<!-- Equal width columns -->
<div class="row">
    <div class="col">Column 1</div>
    <div class="col">Column 2</div>
    <div class="col">Column 3</div>
</div>

<!-- Specific widths -->
<div class="row">
    <div class="col-8">8 columns wide</div>
    <div class="col-4">4 columns wide</div>
</div>

<!-- Responsive columns -->
<div class="row">
    <div class="col-12 col-sm-6 col-md-4">Responsive column</div>
    <div class="col-12 col-sm-6 col-md-8">Responsive column</div>
</div>
```

### Grid Utilities
- `.offset-{number}` - Offset columns
- `.order-{number}` - Change column order
- `.g-{number}` - Gutters (0-5)
- `.gx-{number}` - Horizontal gutters
- `.gy-{number}` - Vertical gutters

```html
<!-- Offset example -->
<div class="row">
    <div class="col-4 offset-4">Centered column</div>
</div>

<!-- Order example -->
<div class="row">
    <div class="col order-3">First column (order-3)</div>
    <div class="col order-1">Second column (order-1)</div>
    <div class="col order-2">Third column (order-2)</div>
</div>
```

---

## Containers

### Container Types
```html
<!-- Fixed-width container -->
<div class="container">
    Fixed width container
</div>

<!-- Fluid container (full-width) -->
<div class="container-fluid">
    Full width container
</div>

<!-- Responsive containers -->
<div class="container-sm">Small container</div>
<div class="container-md">Medium container</div>
<div class="container-lg">Large container</div>
<div class="container-xl">Extra large container</div>
<div class="container-xxl">Extra extra large container</div>
```

---

## Typography

### Headings
```html
<h1 class="display-1">Display 1</h1>
<h1 class="display-2">Display 2</h1>
<h1 class="display-3">Display 3</h1>
<h1 class="display-4">Display 4</h1>
<h1 class="display-5">Display 5</h1>
<h1 class="display-6">Display 6</h1>

<!-- Regular headings -->
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>

<!-- Heading classes -->
<p class="h1">Heading 1 class</p>
<p class="h2">Heading 2 class</p>
```

### Text Utilities
```html
<!-- Font weight -->
<p class="fw-bold">Bold text</p>
<p class="fw-bolder">Bolder text</p>
<p class="fw-normal">Normal text</p>
<p class="fw-light">Light text</p>
<p class="fw-lighter">Lighter text</p>

<!-- Font style -->
<p class="fst-italic">Italic text</p>
<p class="fst-normal">Normal text</p>

<!-- Text decoration -->
<p class="text-decoration-underline">Underlined text</p>
<p class="text-decoration-line-through">Line through text</p>
<p class="text-decoration-none">No decoration</p>

<!-- Text transform -->
<p class="text-lowercase">LOWERCASE TEXT</p>
<p class="text-uppercase">uppercase text</p>
<p class="text-capitalize">capitalize text</p>

<!-- Text alignment -->
<p class="text-start">Start aligned text</p>
<p class="text-center">Center aligned text</p>
<p class="text-end">End aligned text</p>
<p class="text-justify">Justified text</p>

<!-- Font size -->
<p class="fs-1">Font size 1</p>
<p class="fs-2">Font size 2</p>
<p class="fs-3">Font size 3</p>
<p class="fs-4">Font size 4</p>
<p class="fs-5">Font size 5</p>
<p class="fs-6">Font size 6</p>
```

### Lead and Small Text
```html
<p class="lead">Lead paragraph - stands out</p>
<p><small>Small text</small></p>
<p class="small">Small text with class</p>
```

---

## Colors

### Text Colors
```html
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-success">Success text</p>
<p class="text-danger">Danger text</p>
<p class="text-warning">Warning text</p>
<p class="text-info">Info text</p>
<p class="text-light">Light text</p>
<p class="text-dark">Dark text</p>
<p class="text-muted">Muted text</p>
<p class="text-white">White text</p>
<p class="text-black">Black text</p>
```

### Background Colors
```html
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-success">Success background</div>
<div class="bg-danger">Danger background</div>
<div class="bg-warning">Warning background</div>
<div class="bg-info">Info background</div>
<div class="bg-light">Light background</div>
<div class="bg-dark">Dark background</div>
<div class="bg-white">White background</div>
<div class="bg-transparent">Transparent background</div>
```

### Gradient Backgrounds
```html
<div class="bg-gradient bg-primary">Primary gradient</div>
<div class="bg-gradient bg-secondary">Secondary gradient</div>
<div class="bg-gradient bg-success">Success gradient</div>
```

---

## Font Families

### Default Font Stack
Bootstrap uses a native font stack for optimum text rendering:
```css
font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
```

### Custom Font Implementation
```html
<!-- Link Google Fonts in head -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">

<!-- Custom CSS -->
<style>
.custom-font {
    font-family: 'Roboto', sans-serif;
}

.serif-font {
    font-family: 'Georgia', serif;
}

.monospace-font {
    font-family: 'Courier New', monospace;
}
</style>

<!-- Usage -->
<p class="custom-font">Text with custom font</p>
<p class="serif-font">Text with serif font</p>
<p class="monospace-font">Text with monospace font</p>
```

### Font Family Utilities (Custom)
```css
/* Add to your CSS */
.font-sans {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.font-serif {
    font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

.font-mono {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
}
```

---

## Buttons

### Basic Buttons
```html
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-danger">Danger</button>
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-info">Info</button>
<button type="button" class="btn btn-light">Light</button>
<button type="button" class="btn btn-dark">Dark</button>
<button type="button" class="btn btn-link">Link</button>
```

### Outline Buttons
```html
<button type="button" class="btn btn-outline-primary">Primary</button>
<button type="button" class="btn btn-outline-secondary">Secondary</button>
<button type="button" class="btn btn-outline-success">Success</button>
<button type="button" class="btn btn-outline-danger">Danger</button>
```

### Button Sizes
```html
<button type="button" class="btn btn-primary btn-lg">Large button</button>
<button type="button" class="btn btn-primary">Default button</button>
<button type="button" class="btn btn-primary btn-sm">Small button</button>
```

### Button States
```html
<button type="button" class="btn btn-primary active">Active button</button>
<button type="button" class="btn btn-primary" disabled>Disabled button</button>
```

### Button Groups
```html
<div class="btn-group" role="group">
    <button type="button" class="btn btn-primary">Left</button>
    <button type="button" class="btn btn-primary">Middle</button>
    <button type="button" class="btn btn-primary">Right</button>
</div>

<!-- Vertical button group -->
<div class="btn-group-vertical" role="group">
    <button type="button" class="btn btn-primary">Button 1</button>
    <button type="button" class="btn btn-primary">Button 2</button>
    <button type="button" class="btn btn-primary">Button 3</button>
</div>
```

---

## Cards

### Basic Card
```html
<div class="card">
    <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
</div>
```

### Card with Image
```html
<div class="card" style="width: 18rem;">
    <img src="..." class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
</div>
```

### Card Header and Footer
```html
<div class="card">
    <div class="card-header">
        Card Header
    </div>
    <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Card content</p>
    </div>
    <div class="card-footer text-muted">
        Card Footer
    </div>
</div>
```

### Card Groups
```html
<div class="card-group">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Card 1</h5>
            <p class="card-text">Card content</p>
        </div>
    </div>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Card 2</h5>
            <p class="card-text">Card content</p>
        </div>
    </div>
</div>
```

---

## Forms

### Basic Form
```html
<form>
    <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" placeholder="name@example.com">
    </div>
    <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password">
    </div>
    <div class="mb-3">
        <label for="message" class="form-label">Message</label>
        <textarea class="form-control" id="message" rows="3"></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

### Form Controls
```html
<!-- Text input -->
<input type="text" class="form-control" placeholder="Text input">

<!-- Select -->
<select class="form-select">
    <option>Choose...</option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
</select>

<!-- Checkbox -->
<div class="form-check">
    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
    <label class="form-check-label" for="flexCheckDefault">
        Default checkbox
    </label>
</div>

<!-- Radio -->
<div class="form-check">
    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
    <label class="form-check-label" for="flexRadioDefault1">
        Default radio
    </label>
</div>
```

### Form Sizing
```html
<input class="form-control form-control-lg" type="text" placeholder="Large input">
<input class="form-control" type="text" placeholder="Default input">
<input class="form-control form-control-sm" type="text" placeholder="Small input">
```

### Input Groups
```html
<div class="input-group mb-3">
    <span class="input-group-text">@</span>
    <input type="text" class="form-control" placeholder="Username">
</div>

<div class="input-group mb-3">
    <input type="text" class="form-control" placeholder="Recipient's username">
    <span class="input-group-text">@example.com</span>
</div>
```

### Form Validation
```html
<form class="needs-validation" novalidate>
    <div class="mb-3">
        <label for="validationCustom01" class="form-label">First name</label>
        <input type="text" class="form-control" id="validationCustom01" required>
        <div class="valid-feedback">
            Looks good!
        </div>
        <div class="invalid-feedback">
            Please provide a valid first name.
        </div>
    </div>
    <button class="btn btn-primary" type="submit">Submit form</button>
</form>
```

---

## Navbar

### Basic Navbar
```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Features</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Pricing</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

### Navbar with Dropdown
```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown">
                        Dropdown link
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

### Navbar Colors
```html
<nav class="navbar navbar-dark bg-dark">
<nav class="navbar navbar-dark bg-primary">
<nav class="navbar navbar-light bg-light">
<nav class="navbar navbar-light bg-warning">
```

---

## Modals

### Basic Modal
```html
<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                Modal body content goes here.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>
```

### Modal Sizes
```html
<!-- Small modal -->
<div class="modal-dialog modal-sm">

<!-- Large modal -->
<div class="modal-dialog modal-lg">

<!-- Extra large modal -->
<div class="modal-dialog modal-xl">

<!-- Full screen modal -->
<div class="modal-dialog modal-fullscreen">
```

### Centered Modal
```html
<div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
        <!-- Modal content -->
    </div>
</div>
```

---

## Alerts

### Basic Alerts
```html
<div class="alert alert-primary" role="alert">
    A simple primary alert—check it out!
</div>
<div class="alert alert-secondary" role="alert">
    A simple secondary alert—check it out!
</div>
<div class="alert alert-success" role="alert">
    A simple success alert—check it out!
</div>
<div class="alert alert-danger" role="alert">
    A simple danger alert—check it out!
</div>
<div class="alert alert-warning" role="alert">
    A simple warning alert—check it out!
</div>
<div class="alert alert-info" role="alert">
    A simple info alert—check it out!
</div>
<div class="alert alert-light" role="alert">
    A simple light alert—check it out!
</div>
<div class="alert alert-dark" role="alert">
    A simple dark alert—check it out!
</div>
```

### Dismissible Alerts
```html
<div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Holy guacamole!</strong> You should check in on some of those fields below.
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
```

### Alert with Link
```html
<div class="alert alert-primary" role="alert">
    A simple primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
</div>
```

---

## Carousel

### Basic Carousel
```html
<div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="..." class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
            <img src="..." class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
            <img src="..." class="d-block w-100" alt="...">
        </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        <span class="visually-hidden">Next</span>
    </button>
</div>
```

### Carousel with Indicators
```html
<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
    </div>
    <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="..." class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
            <img src="..." class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
            <img src="..." class="d-block w-100" alt="...">
        </div>
    </div>
</div>
```

### Carousel with Captions
```html
<div class="carousel-item active">
    <img src="..." class="d-block w-100" alt="...">
    <div class="carousel-caption d-none d-md-block">
        <h5>First slide label</h5>
        <p>Some representative placeholder content for the first slide.</p>
    </div>
</div>
```

---

## Jumbotron

### Jumbotron (Bootstrap 5 Alternative)
Bootstrap 5 removed the jumbotron component, but you can create similar effects:

```html
<div class="container-fluid py-5 bg-primary text-white">
    <div class="container">
        <h1 class="display-5 fw-bold">Custom jumbotron</h1>
        <p class="col-md-8 fs-4">Using a series of utilities, you can create this jumbotron, just like the one in previous versions of Bootstrap.</p>
        <button class="btn btn-outline-light btn-lg" type="button">Example button</button>
    </div>
</div>
```

### Hero Section (Modern Alternative)
```html
<div class="bg-primary text-white">
    <div class="container py-5">
        <div class="row py-5">
            <div class="col-lg-6">
                <h1 class="display-4 fw-bold">Hello, world!</h1>
                <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                <hr class="my-4">
                <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                <a class="btn btn-light btn-lg" href="#" role="button">Learn more</a>
            </div>
        </div>
    </div>
</div>
```

---

## Utilities

### Margin and Padding
```html
<!-- Margin -->
<div class="m-0">No margin</div>
<div class="m-1">Small margin</div>
<div class="m-2">Medium margin</div>
<div class="m-3">Large margin</div>
<div class="m-4">Extra large margin</div>
<div class="m-5">Extra extra large margin</div>

<!-- Specific sides -->
<div class="mt-3">Margin top</div>
<div class="mb-3">Margin bottom</div>
<div class="ml-3">Margin left</div>
<div class="mr-3">Margin right</div>
<div class="mx-3">Margin horizontal</div>
<div class="my-3">Margin vertical</div>

<!-- Padding -->
<div class="p-0">No padding</div>
<div class="p-1">Small padding</div>
<div class="p-2">Medium padding</div>
<div class="p-3">Large padding</div>
<div class="p-4">Extra large padding</div>
<div class="p-5">Extra extra large padding</div>

<!-- Specific sides -->
<div class="pt-3">Padding top</div>
<div class="pb-3">Padding bottom</div>
<div class="pl-3">Padding left</div>
<div class="pr-3">Padding right</div>
<div class="px-3">Padding horizontal</div>
<div class="py-3">Padding vertical</div>
```

### Position
```html
<div class="position-static">Static positioning</div>
<div class="position-relative">Relative positioning</div>
<div class="position-absolute">Absolute positioning</div>
<div class="position-fixed">Fixed positioning</div>
<div class="position-sticky">Sticky positioning</div>

<!-- Position utilities -->
<div class="position-absolute top-0 start-0">Top left</div>
<div class="position-absolute top-0 end-0">Top right</div>
<div class="position-absolute bottom-0 start-0">Bottom left</div>
<div class="position-absolute bottom-0 end-0">Bottom right</div>
<div class="position-absolute top-50 start-50 translate-middle">Centered</div>
```

### Z-Index
```html
<div class="z-index-n1">Z-index -1</div>
<div class="z-index-0">Z-index 0</div>
<div class="z-index-1">Z-index 1</div>
<div class="z-index-2">Z-index 2</div>
<div class="z-index-3">Z-index 3</div>
```

### Display
```html
<div class="d-none">Hidden</div>
<div class="d-block">Block</div>
<div class="d-inline">Inline</div>
<div class="d-inline-block">Inline block</div>
<div class="d-flex">Flex</div>
<div class="d-inline-flex">Inline flex</div>
<div class="d-grid">Grid</div>
<div class="d-table">Table</div>

<!-- Responsive display -->
<div class="d-none d-md-block">Hidden on mobile, visible on desktop</div>
<div class="d-block d-md-none">Visible on mobile, hidden on desktop</div>
```

### Flexbox
```html
<!-- Flex direction -->
<div class="d-flex flex-row">Flex row</div>
<div class="d-flex flex-column">Flex column</div>
<div class="d-flex flex-row-reverse">Flex row reverse</div>
<div class="d-flex flex-column-reverse">Flex column reverse</div>

<!-- Justify content -->
<div class="d-flex justify-content-start">Justify start</div>
<div class="d-flex justify-content-center">Justify center</div>
<div class="d-flex justify-content-end">Justify end</div>
<div class="d-flex justify-content-between">Justify between</div>
<div class="d-flex justify-content-around">Justify around</div>
<div class="d-flex justify-content-evenly">Justify evenly</div>

<!-- Align items -->
<div class="d-flex align-items-start">Align start</div>
<div class="d-flex align-items-center">Align center</div>
<div class="d-flex align-items-end">Align end</div>
<div class="d-flex align-items-baseline">Align baseline</div>
<div class="d-flex align-items-stretch">Align stretch</div>

<!-- Flex wrap -->
<div class="d-flex flex-wrap">Flex wrap</div>
<div class="d-flex flex-nowrap">Flex nowrap</div>
<div class="d-flex flex-wrap-reverse">Flex wrap reverse</div>

<!-- Flex grow and shrink -->
<div class="flex-grow-1">Flex grow</div>
<div class="flex-shrink-1">Flex shrink</div>
<div class="flex-fill">Flex fill</div>
```

### Shadows
```html
<div class="shadow-none">No shadow</div>
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Regular shadow</div>
<div class="shadow-lg">Large shadow</div>
```

### Borders
```html
<!-- Border -->
<div class="border">Border</div>
<div class="border-top">Border top</div>
<div class="border-end">Border end</div>
<div class="border-bottom">Border bottom</div>
<div class="border-start">Border start</div>

<!-- Remove border -->
<div class="border-0">No border</div>
<div class="border-top-0">No top border</div>

<!-- Border colors -->
<div class="border border-primary">Primary border</div>
<div class="border border-secondary">Secondary border</div>
<div class="border border-success">Success border</div>
<div class="border border-danger">Danger border</div>
<div class="border border-warning">Warning border</div>
<div class="border border-info">Info border</div>
<div class="border border-light">Light border</div>
<div class="border border-dark">Dark border</div>
<div class="border border-white">White border</div>

<!-- Border radius -->
<div class="rounded">Rounded</div>
<div class="rounded-top">Rounded top</div>
<div class="rounded-end">Rounded end</div>
<div class="rounded-bottom">Rounded bottom</div>
<div class="rounded-start">Rounded start</div>
<div class="rounded-circle">Rounded circle</div>
<div class="rounded-pill">Rounded pill</div>
<div class="rounded-0">No rounded corners</div>
<div class="rounded-1">Small rounded</div>
<div class="rounded-2">Medium rounded</div>
<div class="rounded-3">Large rounded</div>
```

### Width and Height
```html
<!-- Width -->
<div class="w-25">Width 25%</div>
<div class="w-50">Width 50%</div>
<div class="w-75">Width 75%</div>
<div class="w-100">Width 100%</div>
<div class="w-auto">Width auto</div>

<!-- Height -->
<div class="h-25">Height 25%</div>
<div class="h-50">Height 50%</div>
<div class="h-75">Height 75%</div>
<div class="h-100">Height 100%</div>
<div class="h-auto">Height auto</div>

<!-- Max width and height -->
<div class="mw-100">Max width 100%</div>
<div class="mh-100">Max height 100%</div>

<!-- Viewport width and height -->
<div class="vw-100">Viewport width 100%</div>
<div class="vh-100">Viewport height 100%</div>
<div class="min-vw-100">Min viewport width 100%</div>
<div class="min-vh-100">Min viewport height 100%</div>
```

### Overflow
```html
<div class="overflow-auto">Overflow auto</div>
<div class="overflow-hidden">Overflow hidden</div>
<div class="overflow-visible">Overflow visible</div>
<div class="overflow-scroll">Overflow scroll</div>
```

### Visibility
```html
<div class="visible">Visible</div>
<div class="invisible">Invisible</div>
```

---

## Advanced CSS Concepts

### Transitions
```html
<!-- Custom CSS for transitions -->
<style>
.transition-all {
    transition: all 0.3s ease-in-out;
}

.transition-color {
    transition: color 0.3s ease-in-out;
}

.transition-transform {
    transition: transform 0.3s ease-in-out;
}
</style>

<!-- Usage -->
<button class="btn btn-primary transition-all">Hover me</button>
```

### Transforms
```html
<!-- Custom CSS for transforms -->
<style>
.transform-scale:hover {
    transform: scale(1.1);
}

.transform-rotate:hover {
    transform: rotate(45deg);
}

.transform-translate:hover {
    transform: translateX(10px);
}

.transform-skew:hover {
    transform: skew(10deg, 5deg);
}
</style>

<!-- Usage -->
<div class="transform-scale">Scale on hover</div>
<div class="transform-rotate">Rotate on hover</div>
<div class="transform-translate">Translate on hover</div>
<div class="transform-skew">Skew on hover</div>
```

### Object Fit
```html
<img src="..." class="object-fit-contain" alt="...">
<img src="..." class="object-fit-cover" alt="...">
<img src="..." class="object-fit-fill" alt="...">
<img src="..." class="object-fit-scale" alt="...">
<img src="..." class="object-fit-none" alt="...">
```

### CSS Grid (Custom)
```html
<style>
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.grid-item {
    background: #f8f9fa;
    padding: 1rem;
    border: 1px solid #dee2e6;
}
</style>

<div class="grid-container">
    <div class="grid-item">Grid item 1</div>
    <div class="grid-item">Grid item 2</div>
    <div class="grid-item">Grid item 3</div>
</div>
```

---

## Additional Components

### Breadcrumb
```html
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Library</a></li>
        <li class="breadcrumb-item active" aria-current="page">Data</li>
    </ol>
</nav>
```

### Pagination
```html
<nav aria-label="Page navigation">
    <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#">Previous</a></li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item active"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
    </ul>
</nav>
```

### Progress Bars
```html
<div class="progress">
    <div class="progress-bar" role="progressbar" style="width: 25%"></div>
</div>

<div class="progress">
    <div class="progress-bar bg-success" role="progressbar" style="width: 50%"></div>
</div>

<div class="progress">
    <div class="progress-bar progress-bar-striped" role="progressbar" style="width: 75%"></div>
</div>

<div class="progress">
    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%"></div>
</div>
```

### Spinners
```html
<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
</div>

<div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
</div>

<div class="spinner-grow" role="status">
    <span class="visually-hidden">Loading...</span>
</div>

<div class="spinner-grow text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
</div>
```

### Tooltips
```html
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
    Tooltip on top
</button>

<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">
    Tooltip on right
</button>

<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">
    Tooltip on bottom
</button>

<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">
    Tooltip on left
</button>

<!-- JavaScript to enable tooltips -->
<script>
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})
</script>
```

### Popovers
```html
<button type="button" class="btn btn-lg btn-danger" data-bs-toggle="popover" title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?">
    Click to toggle popover
</button>

<!-- JavaScript to enable popovers -->
<script>
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})
</script>
```

### Accordion
```html
<div class="accordion" id="accordionExample">
    <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                Accordion Item #1
            </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div class="accordion-body">
                <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element.
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header" id="headingTwo">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                Accordion Item #2
            </button>
        </h2>
        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div class="accordion-body">
                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.
            </div>
        </div>
    </div>
</div>
```

### Tabs
```html
<ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
        <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab">Home</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab">Profile</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab">Contact</button>
    </li>
</ul>
<div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active" id="home" role="tabpanel">Home content</div>
    <div class="tab-pane fade" id="profile" role="tabpanel">Profile content</div>
    <div class="tab-pane fade" id="contact" role="tabpanel">Contact content</div>
</div>
```

### Offcanvas
```html
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample">
    Button with data-bs-target
</button>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title">Offcanvas</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
        Content for the offcanvas goes here. You can place just about any Bootstrap component or custom elements here.
    </div>
</div>
```

---

## Custom CSS Tips and Tricks

### Font Loading Performance
```css
/* Preload fonts */
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" as="style">

/* Font display swap for better performance */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
```

### Custom Bootstrap Variables
```scss
// Custom Bootstrap variables (if using Sass)
$primary: #007bff;
$secondary: #6c757d;
$success: #28a745;
$info: #17a2b8;
$warning: #ffc107;
$danger: #dc3545;
$light: #f8f9fa;
$dark: #343a40;

// Custom breakpoints
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

### Responsive Images
```html
<img src="..." class="img-fluid" alt="Responsive image">
<img src="..." class="img-thumbnail" alt="Thumbnail image">

<!-- Figure -->
<figure class="figure">
    <img src="..." class="figure-img img-fluid rounded" alt="...">
    <figcaption class="figure-caption">A caption for the above image.</figcaption>
</figure>
```

### Utility Classes for Common Patterns
```html
<!-- Centered content -->
<div class="d-flex justify-content-center align-items-center vh-100">
    <div>Centered content</div>
</div>

<!-- Sticky footer -->
<div class="d-flex flex-column min-vh-100">
    <main class="flex-grow-1">
        Main content
    </main>
    <footer class="mt-auto">
        Footer
    </footer>
</div>

<!-- Equal height cards -->
<div class="row row-cols-1 row-cols-md-3 g-4">
    <div class="col">
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
        </div>
    </div>
</div>
```

---

## JavaScript Integration

### Basic JavaScript for Bootstrap Components
```javascript
// Initialize tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Initialize popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

// Modal events
var myModal = document.getElementById('myModal')
var myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', function () {
    myInput.focus()
})

// Toast
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
})
```

---

## Best Practices and Tips

### Performance Tips
1. **Use CDN**: Always use CDN for faster loading
2. **Minimize custom CSS**: Use Bootstrap utilities instead of custom CSS when possible
3. **Optimize images**: Use responsive images and proper formats
4. **Bundle JavaScript**: Use the bundle version to reduce HTTP requests

### Accessibility Tips
1. **Use semantic HTML**: Use proper HTML elements
2. **Add ARIA labels**: Provide accessibility labels
3. **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
4. **Color contrast**: Ensure proper color contrast ratios

### Responsive Design Tips
1. **Mobile-first**: Design for mobile devices first
2. **Test on real devices**: Test on actual mobile devices
3. **Use breakpoints wisely**: Don't overcomplicate responsive design
4. **Optimize for touch**: Ensure touch targets are large enough

### Code Organization
1. **Structure HTML properly**: Use semantic HTML structure
2. **Organize CSS**: Group related styles together
3. **Comment your code**: Add comments for complex sections
4. **Use consistent naming**: Follow consistent naming conventions

---

## Common Patterns and Examples

### Landing Page Header
```html
<header class="bg-primary text-white">
    <div class="container py-5">
        <div class="row align-items-center">
            <div class="col-lg-6">
                <h1 class="display-4 fw-bold">Welcome to Our Site</h1>
                <p class="lead">This is a great place to introduce your product or service.</p>
                <a href="#" class="btn btn-light btn-lg">Get Started</a>
            </div>
            <div class="col-lg-6">
                <img src="..." class="img-fluid rounded" alt="Hero image">
            </div>
        </div>
    </div>
</header>
```

### Feature Cards Section
```html
<section class="py-5">
    <div class="container">
        <div class="row text-center mb-5">
            <div class="col">
                <h2 class="display-5 fw-bold">Our Features</h2>
                <p class="lead">Discover what makes us special</p>
            </div>
        </div>
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="fas fa-star fa-3x text-primary mb-3"></i>
                        <h5 class="card-title">Feature One</h5>
                        <p class="card-text">Description of feature one with some details.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="fas fa-heart fa-3x text-danger mb-3"></i>
                        <h5 class="card-title">Feature Two</h5>
                        <p class="card-text">Description of feature two with some details.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card h-100 text-center">
                    <div class="card-body">
                        <i class="fas fa-shield-alt fa-3x text-success mb-3"></i>
                        <h5 class="card-title">Feature Three</h5>
                        <p class="card-text">Description of feature three with some details.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

### Contact Form
```html
<section class="py-5 bg-light">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <h2 class="text-center mb-5">Contact Us</h2>
                <form>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="firstName" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="firstName" required>
                        </div>
                        <div class="col-md-6">
                            <label for="lastName" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="lastName" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="subject" class="form-label">Subject</label>
                        <input type="text" class="form-control" id="subject" required>
                    </div>
                    <div class="mb-3">
                        <label for="message" class="form-label">Message</label>
                        <textarea class="form-control" id="message" rows="5" required></textarea>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary btn-lg">Send Message</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
```

---

## Conclusion

This comprehensive Bootstrap cheat sheet covers all the essential components, utilities, and patterns you need to build modern, responsive websites. Remember to:

1. Always use the latest version of Bootstrap
2. Test your designs on multiple devices
3. Follow accessibility best practices
4. Optimize for performance
5. Keep your code organized and maintainable

For the most up-to-date information, always refer to the official Bootstrap documentation at [https://getbootstrap.com/](https://getbootstrap.com/).

Happy coding with Bootstrap!