import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useLocation } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { ChevronDown, MapPin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios';
import { ThemeToggle } from './ThemeToggle';
import { getAllRegions, REGION_CONFIGS } from '@/constants/regionConfigs';

function Header() {
  const location = useLocation();
  const isOnCreateTripPage = location.pathname.includes('create-trip');

  // Extract region from URL path (e.g., /kashmir -> kashmir, /europe -> europe)
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const potentialRegion = pathSegments[0];
  const currentRegionId = REGION_CONFIGS[potentialRegion] ? potentialRegion : null;

  // Build create-trip link based on current region
  const createTripPath = currentRegionId ? `/${currentRegionId}/create-trip` : '/create-trip';

  const user = JSON.parse(localStorage.getItem('user') || "null");
  const [openDailog, setOpenDailog] = useState(false);
  const [showRegions, setShowRegions] = useState(false);

  const regions = getAllRegions();

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => { }
  })

  const GetUserProfile = async (tokenInfo) => {
    try {
      const resp = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: 'application/json',
          },
        }
      );

      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDailog(false);
      window.location.reload();
    } catch (err) {

    }
  };


  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5 sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b dark:border-neutral-800 transition-colors duration-300'>
      <a href='/'>
        <div className='flex items-center gap-2 group cursor-pointer'>
          <div className='bg-gradient-to-br from-emerald-500 to-amber-500 p-2 rounded-xl shadow-lg group-hover:rotate-6 transition-transform duration-300'>
            <span className='text-white font-bold text-xl'>Ai</span>
          </div>
          <div className='flex flex-col'>
            <span className='font-bold text-xl tracking-tight text-neutral-900 dark:text-white transition-colors duration-300'>
              Trip<span className='text-emerald-600 dark:text-emerald-400'>Planner</span>
            </span>
            <span className='text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500 dark:text-neutral-400 -mt-1'>
              Your AI Travel Companion
            </span>
          </div>
        </div>
      </a>
      <div>
        {user ?
          <div className='flex items-center gap-3'>
            {/* Region Selector Dropdown */}
            <Popover open={showRegions} onOpenChange={setShowRegions}>
              <PopoverContent className="w-64 p-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <div className="grid gap-1">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2 py-1">Choose your destination</p>
                  {regions.map((region) => (
                    <a
                      key={region.id}
                      href={`/create-trip/${region.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      onClick={() => setShowRegions(false)}
                    >
                      <span className="text-xl">{region.emoji}</span>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white text-sm">{region.name}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {!isOnCreateTripPage && (
              <a href={createTripPath}>
                <Button variant="outline"
                  className="rounded-full border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 transition-colors">+ Create Trip</Button>
              </a>
            )}
            <a href='/my-trips'>
              <Button variant="outline"
                className="rounded-full border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 transition-colors">My Trips</Button>
            </a>
            <ThemeToggle />
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} className='h-[35px] w-[35px] rounded-full ring-2 ring-neutral-200 dark:ring-neutral-800' />
              </PopoverTrigger>
              <PopoverContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <h2 className='cursor-pointer text-neutral-900 dark:text-neutral-100' onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Logout</h2>
              </PopoverContent>
            </Popover>
          </div>
          :
          <div className='flex items-center gap-4'>
            {/* Region Selector Dropdown for non-logged in users */}
            <Popover open={showRegions} onOpenChange={setShowRegions}>
              <PopoverTrigger asChild>
                <Button variant="outline"
                  className="rounded-full border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 transition-colors gap-2">
                  <MapPin className="h-4 w-4" />
                  Destinations
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                <div className="grid gap-1">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2 py-1">Choose your destination</p>
                  {regions.map((region) => (
                    <a
                      key={region.id}
                      href={`/create-trip/${region.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      onClick={() => setShowRegions(false)}
                    >
                      <span className="text-xl">{region.emoji}</span>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white text-sm">{region.name}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <ThemeToggle />
            <Button className="bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-700 hover:to-amber-600 text-white border-none rounded-full px-6" onClick={() => setOpenDailog(true)}>Sign In</Button>
          </div>
        }
      </div>
      <Dialog open={openDailog}>

        <DialogContent>
          <DialogHeader>

            <DialogDescription>
              <div className='flex flex-col items-center justify-center py-6'>
                <div className='bg-gradient-to-br from-emerald-500 to-amber-500 p-4 rounded-2xl shadow-xl mb-4'>
                  <span className='text-white font-bold text-3xl'>Ai</span>
                </div>
                <h2 className='font-bold text-2xl text-neutral-900 dark:text-white'>Trip Planner</h2>
              </div>
              <p>Sign in to the App with Google authentication securely</p>

              <Button

                onClick={login}
                className="w-full mt-5 flex gap-4 items-center">

                <FcGoogle className='h-7 w-7' />
                Sign In With Google

              </Button>

            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header