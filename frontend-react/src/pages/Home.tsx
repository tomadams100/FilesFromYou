import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const modalRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold space-x-6">FilesFromYou</h1>
            <h2 className="text-2xl italic">Share files at rocket speed 🚀</h2>
            <p className="py-6">
              Blast through file sharing at rocket speed with FilesFromYou!
              Effortless. Fast. Yours.
            </p>
            <button
              className="btn bg-amber-500"
              onClick={() => modalRef.current?.showModal()}
            >
              Get Started
            </button>
            <dialog id="my_modal_1" className="modal" ref={modalRef}>
              <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">
                  We're still building the actual file sharing bit...😅
                </p>
                <p className="py-2">
                  You could checkout the latest CPU usage if you like on the
                  dashboard!
                  <Link className="btn btn-sm bg-amber-500" to="/dashboard">
                    Launch dashboard
                  </Link>
                </p>

                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn btn-sm">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
      <div
        role="alert"
        className="alert bg-amber-500 fixed bottom-5 left-5 right-5 p-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>
          Warning: Some users are experiencing high CPU Usage! Go to the{' '}
          <Link to="/dashboard" className="underline text-gray-100">
            CPU Dashboard
          </Link>{' '}
          to see
        </span>
      </div>
    </>
  );
}
