import React from 'react';

const Navigation = ({onRouteChange}) => {
	return (
		<div  className='ma4'>
			<div className='ma1'>	
			  <input 
			  	onClick={() => onRouteChange('register')}
			  	className="align-right b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6" 
			  	type="submit" 
			  	value="Register"
			  />
			</div>
			<div>	
			  <input 
			  	onClick={() => onRouteChange('signIn')}
			  	className="align-right b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6" 
			  	type="submit" 
			  	value="Sign Out"
			  />
			</div>
		</div>	
	);
}

export default Navigation;