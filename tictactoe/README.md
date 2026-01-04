# README

This application provides initial exposure to reacts workings.
Such as
  - passing data through props and 'lifting state' up to the parent component
    - Board component keeps state, passes through to squares
    - Game component keeps history, passes squares, and who is next to play down to the
      Board
  - making interactive components
  - importance of immutability for keeping history
    - i.e essentially a built in memento pattern, which is dope
    - replace data with a new copy so we can move between data states
      - i.e calling `slice()` on `squares` and modifying the copy

Notes from the [tutorial](https://react.dev/learn/tutorial-tic-tac-toe#declaring-a-winner)

>Immutability makes complex features much easier to implement. Later in this tutorial, you will implement a "time travel" feature that lets you review the game's history and "jump back" to past moves. This functionality isn't specific to games—an ability to undo and redo certain actions is a common requirement for apps. Avoiding direct data mutation lets you keep previous versions of the data intact, and reuse them later.

>There is also another benefit of immutability. By default, all child components re-render automatically when the state of a parent component changes. This includes even the child components that weren't affected by the change. Although re-rendering is not by itself noticeable to the user (you shouldn't actively try to avoid it!), you might want to skip re-rendering a part of the tree that clearly wasn't affected by it for performance reasons. Immutability makes it very cheap for components to compare whether their data has changed or not. You can learn more about how React chooses when to re-render a component in the memo API reference.

