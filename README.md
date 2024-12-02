
# 🪟 easy-dialogs

Easy to use, function-based dialogs manager for React.


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

#### 1. Import <Dialog /> to your root layout.
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
]
```

#### 3. Import "useDialogManager()" hook inside react component
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

### ❗ Important
Dialog components **MUST** return some value. `callDialog()` function awaits for the response from the Dialog component.

**Example:**
```jsx
const DialogComponent: React.FC<{ onClose: (result: boolean) => void }> = ({ onClose }) => {
    return (
        <div>
            <h1>Example dialog</h1>
            <button onClick={() => onClose(true)}>Success!</button>
            <button onClick={() => onClose(false)}>Failure :(</button>
        </div>
    );
}

export default DialogComponent;
```


## Acknowledgements

 - [Jotai](https://github.com/pmndrs/jotai)

