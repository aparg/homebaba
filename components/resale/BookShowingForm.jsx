"use client";
import React from "react";
import DateSelector from "./DateSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Calendar,
  CalendarDays,
  MessageCircle,
  MessageSquareText,
} from "lucide-react";
import { Avatar } from "../ui/avatar";
import Image from "next/image";
const BookShowingForm = ({ address }) => {
  return (
    <div className="sticky top-20 z-0 w-full rounded-md bg-very-light-gray flex items-center sm:pt-8 sm:mt-0 shadow-2xl">
      <div className="flex sm:flex-row flex-col w-full overflow-hidden">
        {/* <div className="w-full sm:w-1/2">
          <img
            src={bannerImage}
            alt="property-img"
            className="object-cover w-full h-full"
          />
        </div> */}
        <div className="w-full sm:mx-2 p-4 flex flex-col justify-center items-center">
          {/**Schedule a viewing form */}
          <section className="w-full flex flex-row justify-between">
            <div className="flex flex-row space-x-2 items-center">
              <Avatar className="w-12 h-12 bg-white" />
              <div className="flex flex-col space-y-2 text-lg">
                John Doe
                <button className="border-2 border-gray-600 rounded-md px-1 py-[0.15rem] uppercase tracking-wide text-xs">
                  Homebaba Agent
                </button>
              </div>
            </div>

            <div className="flex items-center flex-row">
              <span className="text-xs md:text-lg font-bold">homebaba</span>
              <Image
                src="/maple-leaf.svg"
                alt="Maple Leaf Icon for Logo"
                width={10}
                height={10}
                className="hidden md:block"
              />
              <Image
                src="/maple-leaf.svg"
                alt="Maple Leaf Icon for Logo"
                width={15}
                height={15}
                className="block md:hidden"
              />
            </div>
          </section>

          <Dialog>
            <div className="p-4 rounded-lg flex flex-col space-y-4 justify-center">
              <p className="flex justify-start space-x-3">
                <CalendarDays />{" "}
                <span>Request a tour as early as tomorrow</span>
              </p>
              <p className="flex justify-start space-x-3">
                <MessageSquareText />{" "}
                <span>For all other questions, contact John Doe</span>
              </p>

              <DialogTrigger>
                <button className="px-10 bg-red-500 text-white font-semibold py-2 text-lg rounded-lg hover:bg-red-600">
                  Book Now
                </button>
              </DialogTrigger>
            </div>
            <DialogContent className="z-[9999] sm:z-auto">
              <DialogHeader>
                <DialogTitle>
                  <div className="text-center text-2xl">Book a showing</div>
                </DialogTitle>
                <DialogDescription>
                  <DateSelector showBookingType={false} address={address} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* <span className="my-4">{address}</span> */}
        </div>
      </div>
    </div>
  );
};

export default BookShowingForm;
