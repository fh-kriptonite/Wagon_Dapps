import React from 'react';
import { Button } from 'flowbite-react';
import { useModal } from '@particle-network/connectkit'

export default function ButtonConnect() {
    const { setOpen } = useModal();
    return (
        <>
            <Button
                size="sm"
                onClick={() => {setOpen(true)}}
                className="button-connect mx-auto"
            >
                Login
            </Button>
        </>
    );
} 