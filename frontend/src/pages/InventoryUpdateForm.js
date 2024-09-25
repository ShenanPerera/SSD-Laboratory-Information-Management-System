import React from 'react'
import InventoryUpdateForm from '../components/InventoryComponent/InventoryUpdateForm'
import withPermission from '../UtillFuntions/withPermission'
import Permission from '../UtillFuntions/Permission'

function UpdateInventory() {

    
    return (
        <div>
            <InventoryUpdateForm/>
        </div>
    )
}

export default withPermission(UpdateInventory, [Permission.ADMIN, Permission.LAB_ASSISTANT]);