---
name: form-ux-design
description: Contact and lead capture form UX patterns. Use when building or improving forms with validation, error states, and accessible interactions.
user-invocable: true
---

# Form UX Design

Design and implement user-friendly, accessible contact and lead capture forms for a real estate portfolio site.

## When to Use

- Building a contact or inquiry form
- Adding form validation (client-side)
- Designing error states and success messaging
- Improving form accessibility
- Implementing spam prevention

## Form Structure Pattern

```html
<form id="contact-form" novalidate>
  <!-- Group related fields -->
  <fieldset>
    <legend class="sr-only">Contact Information</legend>

    <div class="form-group">
      <label for="name">Full Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        autocomplete="name"
        aria-describedby="name-error"
      />
      <p id="name-error" class="error-message" role="alert" hidden>
        Please enter your name.
      </p>
    </div>
  </fieldset>

  <!-- Honeypot for spam prevention -->
  <div aria-hidden="true" style="position:absolute;left:-9999px">
    <input type="text" name="website" tabindex="-1" autocomplete="off" />
  </div>

  <button type="submit">Send Message</button>
</form>
```

## Validation Patterns

### Client-Side Validation

```javascript
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Clear previous errors
  form.querySelectorAll('.error-message').forEach(el => el.hidden = true);

  let isValid = true;
  const fields = form.querySelectorAll('[required]');

  fields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      const error = document.getElementById(`${field.id}-error`);
      if (error) error.hidden = false;
      if (!form.querySelector(':focus.invalid')) field.focus();
    }
  });

  if (isValid) {
    // Submit logic
  }
});
```

### Input Types for Mobile

| Field | Input Type | `inputmode` | `autocomplete` |
|-------|-----------|-------------|----------------|
| Name | `text` | — | `name` |
| Email | `email` | `email` | `email` |
| Phone | `tel` | `tel` | `tel` |
| Message | `textarea` | — | — |
| Zip Code | `text` | `numeric` | `postal-code` |

## Error Messaging

- Show errors inline below the field, not in a summary at top
- Use `role="alert"` for dynamic error messages (screen reader announces)
- Connect errors to inputs with `aria-describedby`
- Use clear, specific language: "Please enter a valid email address" not "Invalid input"
- Show errors on blur (not while typing) and on submit

## Success State

```html
<div role="status" aria-live="polite" class="success-message">
  <p>Thank you! Your message has been sent. We'll be in touch within 24 hours.</p>
</div>
```

- Replace form with success message or show inline confirmation
- Use `role="status"` and `aria-live="polite"` for screen readers
- Include clear next-step expectation ("We'll respond within 24 hours")

## Spam Prevention

- **Honeypot field:** hidden input that bots fill but humans don't
- **Time-based:** reject submissions within 3 seconds of page load
- **No CAPTCHA** — poor UX for a portfolio site; honeypot is sufficient

## Styling with Tailwind

```html
<!-- Input -->
<input class="w-full px-4 py-3 bg-charcoal-90 border border-white/10
              rounded-lg text-white placeholder:text-white/40
              focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold
              transition-colors" />

<!-- Error state -->
<input class="border-red-500 focus:border-red-500 focus:ring-red-500" />
<p class="mt-1 text-xs text-red-400">Error message here</p>

<!-- Submit button -->
<button class="w-full py-3 bg-gold text-charcoal font-semibold rounded-lg
               hover:bg-gold-hover transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed">
  Send Message
</button>
```

## Accessibility Checklist

- [ ] All inputs have visible `<label>` elements (or `aria-label`)
- [ ] Error messages connected via `aria-describedby`
- [ ] Required fields indicated with `required` attribute and visual indicator
- [ ] Focus management: first error field receives focus on submit
- [ ] Color is not the only error indicator (text + icon, not just red border)
- [ ] Tab order follows visual order
- [ ] Submit button has descriptive text (not just "Submit")

## Current State

The Contact component (`src/components/Contact.astro`) currently uses a `mailto:` link, not a form. When adding a form, note the CSP in `BaseLayout.astro` has `form-action 'mailto:'` — this would need updating for form submissions.
