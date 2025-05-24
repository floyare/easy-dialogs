
# 🪟 easy-dialogs

Easy to use, function-based, type safe dialogs manager for React.

[View demo](https://easy-dialogs.vercel.app/) / [NPM](https://www.npmjs.com/package/easy-dialogs)


## Installation

```bash
# yarn
yarn install easy-dialogs

# npm
npm install easy-dialogs

# pnpm
pnpm install easy-dialogs
```
    
## Usage

#### 1. Import <Dialog /> into your root layout.
```jsx
import { Dialog } from "easy-dialogs"

function App() {
    return (
        <section>
            {/* ...rest of your root layout */}
            <Dialog />
        </section>
    )
}

export default App

```


#### 2. Create an array with dialogs list
```typescript
import DialogComponent from "../components/DialogComponent";

export const dialogs = [
    { id: "test-dialog", component: DialogComponent }
    // Here you can add more dialogs
] as const
```

#### 3. Import "useDialogManager()" hook inside React component
```jsx
import { useDialogManager } from "easy-dialogs";
import { dialogs } from "../libs/dialogs";

const List = () => {
    const { callDialog } = useDialogManager(dialogs)
    return (
        <div>
            <button onClick={async () => {
                const result = await callDialog("test-dialog")
                if(result) {
                    alert('Result is success!') 
                }else{
                    alert('Result is failure :(') 
                }
            }}>Call me!</button>
        </div>
    );
}

export default List;
```

### ❗ Important notes
  
  - Dialog components **MUST** return some value. `callDialog()` function awaits for the response from the Dialog component.

    **Example:**
    ```tsx
    type ExampleDialogType = {
        onClose: (val: boolean) => void,
        additionalProps?: {
            id: string
        }
    }

    const DialogComponent: React.FC<ExampleDialogType> = ({ onClose, additionalProps }) => {
        return (
            <div>
                <h1>Example dialog {additionalProps?.id}</h1>
                <button onClick={() => onClose(true)}>Success!</button>
                <button onClick={() => onClose(false)}>Failure :(</button>
            </div>
        );
    }

    export default DialogComponent;
    ```
  - To handle **Exit Animations** in your dialog component, first add the `useExitAnimation: true` property in dialogs list.

    ```tsx
    export const dialogs = [
        { id: "test-dialog", component: DialogComponent, useExitAnimation: true }
        // Here you can add more dialogs
    ] as const
    ```

    Then, in your dialog component you need to set the `data-state` property and the `onAnimationEnd()` function and pass it into the dialog parent.

    ```tsx
    type ExampleDialogType = {
        onClose: (val: boolean) => void,
        ["data-state"]?: string,
        onAnimationEnd?: () => void;
        additionalProps?: {
            id: string
        }
    }

    const DialogComponent: React.FC<ExampleDialogType> = ({ onClose, additionalProps, ...rest }) => {
        return (
            <div data-state={rest["data-state"]} onAnimationEnd={rest.onAnimationEnd}>
                ...
            </div>
        );
    }

    export default DialogComponent;
    ```

    The package will add `data-state="closed"` attribute while everything has been set up properly. In order to handle animations, you must add exit animation for example using **TailwindCSS**: `data-[state=closed]:!animate-fadeout`. **When useExitAnimation is set to true and the animation is not set up, then the dialog won't close!** 

  - For **Next.js** users:  `<Dialog />` component **MUST** be rendered on the client.

## Update history
    - 0.1.6:
        - Added support for dialog exit animations
        - Added 'getActiveDialogs()' export
    - 0.1.5 - Fixed additionalProps type issue
    - 0.1.4 - Added support for multiple dialogs rendered at once.

## Acknowledgements

 - [Jotai](https://github.com/pmndrs/jotai)

