---
category: general
title: Button
order: 1
---

## Definition

> Button to start an immediate operation.

## When to use

A set of operation commands are marked (or encapsulated) to respond to the user's click behavior and trigger the corresponding business logic.

In the Alib sample component, we have four buttons

- Main button: used for moving point of main line. There can only be one main button in an operation area.
- Default button: used for a group of action points without priority.
- Dotted button: commonly used for adding operations.
- Link button: used for secondary or external chain action point.

And four state attributes are used with the above.

- Danger: delete / move / modify authority and other dangerous operations, generally need to be confirmed twice.
- Ghost: it is used in places with complex background color, and is often used in the home page / product page and other display scenes.
- Disable: when the action point is not available, copywriting is generally required.
- Loading: used for asynchronous operations waiting for feedback, multiple submissions can also be avoided.

Directly use the `alibButton` instruction to expand on the original button element:

```
<button alibButton="primary">Button</button>
```

Directly use the `alib-button` component tag:

```
<alib-button alibType="primary">Button</alib-button>
```
