# README

This application provides initial exposure to reacts workings.
Such as
  - passing data through props and 'lifting state' up to the parent component
    - board component keeps state, passes through to squares
    - game component keeps history, passes squares down to the board
  - making interactive components
  - importance of immutability for keeping history
    - replace data with a new copy so we can move between data states
      - i.e calling `slice()` on `squares` and modifying the copy

