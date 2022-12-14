import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { markerModalAtom, selectedGroupAtom } from "../../server/atoms";
import { MarkerData } from "../../types/marker-data";
import { trpc, useMutation } from "../../hooks/trpc";

export const MarkerModal: React.FC<{
  markerData?: MarkerData;
}> = ({ markerData }) => {
  const [isOpen, setIsOpen] = useAtom(markerModalAtom);
  const [selectedGroup] = useAtom(selectedGroupAtom);

  const { invalidateQueries } = trpc.useContext();

  const mutateGroup = useMutation("location.create", {
    onSuccess() {
      invalidateQueries("group.get-by-user");
    },
  });

  const addLocation = async () => {
    setIsOpen(false);
    await mutateGroup.mutateAsync({
      address: markerData?.name as string,
      lat: Number(markerData?.lat),
      lng: Number(markerData?.lng),
      groupId: selectedGroup?.id as string,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl bg-light-coral rounded-2xl">
                <div className="flex items-center">
                  <Dialog.Title
                    as="h3"
                    className="mr-auto text-lg font-medium leading-6 text-left text-white text-gray-900"
                  >
                    {markerData?.name}
                  </Dialog.Title>
                  <button
                    className="px-2 text-2xl text-center rounded-lg bg-baby-pink"
                    onClick={addLocation}
                  >
                    +
                  </button>
                </div>

                <p className="mt-2 mb-4 text-sm text-white">
                  {markerData?.business_status}
                </p>
                <div className="flex flex-wrap">
                  {markerData?.types?.map((type, i) => (
                    <h1
                      key={i}
                      className="px-2 py-2 mb-2 mr-2 rounded-lg bg-baby-pink"
                    >
                      {type}
                    </h1>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
