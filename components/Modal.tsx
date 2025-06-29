'use client'
import { useBoardStore } from '@/Store/BoardStore';
import { useModalStore } from '@/Store/ModalStore'
import { Description, Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { FormEvent, useRef, useState } from 'react'
import TaskTypeRadioGroup from './TaskTypeRadioGroup';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/solid';
function Modal() {
  const imagePickerRef=useRef<HTMLInputElement>(null);
   const isOpen=useModalStore(state=>state.isOpen);
   const closeModal=useModalStore(state=>state.closeModal);
   const newTaskInput=useBoardStore(state=>state.newTaskInput);
   const setNewTaskInput=useBoardStore(state=>state.setNewTaskInput);
   const image =useBoardStore(state=>state.image);
   const setImage=useBoardStore(state=>state.setImage);
   const addTask= useBoardStore(state => state.addTask);
   const newTaskType= useBoardStore(state => state.newTaskType)
   const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
     e.preventDefault();
     if(!newTaskInput) return;
     addTask(newTaskInput , newTaskType , image)
     setImage(null);
     closeModal();
   }
  return (
    <>
      {/* <button onClick={() => setIsOpen(true)}>Open dialog</button> */}
      <Dialog
        open={isOpen}
        as='form'
        onSubmit={handleSubmit}
        onClose={closeModal}
        transition
        className="fixed inset-0  flex w-screen items-center justify-center bg-black/30 p-4 overflow-scroll transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-xlg w-4/12 space-y-4 rounded-md bg-white p-12">
          <DialogTitle as='h3' className="font-medium text-lg leading-6 text-gray-900 pb-2">Add a Task</DialogTitle>
          <div className="mt-2">
            <input
            type='text'
            placeholder='Enter a Task here...'
            className='w-full border border-gray-300 outline-none rounded-md p-5'
            value={newTaskInput}
            onChange={(e)=>setNewTaskInput(e.target.value)}
            />
          </div>
          <TaskTypeRadioGroup/>
          <div className='mt-2'>
            <button
            type='button'
            onClick={()=>{
              imagePickerRef.current?.click();
            }}
             className='w-full border-2 border-gray-300 rounded-md outline-none p-5
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            ' >
              <PhotoIcon className='h-6 w-6 mr-2 inline-block' />
              Upload Image
            </button>
            {image && (
              <Image
              width={200}
              height={200}
              priority 
              alt='uploaded image'
              className='w-full h-48 object-cover mt-2 filter hover:grayscale
              transition-all duration-150 cursor-not-allowed
              '
              src={URL.createObjectURL(image)}
              onClick={()=>{
                setImage(null);
              }}
              />
            )}
            <input
            type='file'
            ref={imagePickerRef}
            hidden
            onChange={(e)=>{
              if(!e.target.files![0].type.startsWith("image/")) return;
              setImage(e.target.files![0])
            }}
            />
          </div>
          <div>
            <button
            type='submit'
            disabled={!newTaskInput}
             className='inline-flex justify-center rounded-md border border-transparent
             bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200
             focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
             disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed
             '
            >
              Add Task
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  )
}
export default Modal;