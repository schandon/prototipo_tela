// import React from 'react';
import { PowerOff } from 'lucide-react'; // Chrome
import { authService } from '../../services/auth';
import mini_logo from '../../assets/jrc_red_logo.svg';

export function header() {
  return (
    <div className="">
      <h1>
        <img className="" src={mini_logo} alt="Logo" />
        JRC Brasil
      </h1>
      <div className="user">
        <span>Administrador</span>
        <PowerOff
          className="ml-4"
          onClick={() => {
            console.log('Saindo');
            authService.logout();
          }}
        />
      </div>
    </div>
  );
}
