(function () {
  if (window.__freeProdAdd) return;
  window.__freeProdAdd = true;
  const SHOP = Shopify.shop;
  const APP = (window.freeProductAdderAppUrl || "https://shopify-discount-app-production.up.railway.app/").replace(/\/$/, "");
  let lock = false;
  let lastCart = null;

  console.log("[FreeProductAdder] Script loaded. Shop:", SHOP, "App URL:", APP);

  function showLoader() {
    if (document.getElementById('free-prod-loading-overlay')) return;

    if (!document.getElementById('free-prod-loader-styles')) {
      const styles = document.createElement('style');
      styles.id = 'free-prod-loader-styles';
      styles.textContent = `
        #free-prod-loading-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: rgba(255, 255, 255, 0.85) !important;
          backdrop-filter: blur(6px) !important;
          -webkit-backdrop-filter: blur(6px) !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 2147483647 !important;
          opacity: 0;
          transition: opacity 0.2s ease;
          color: #0f172a !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          pointer-events: all !important;
        }
        #free-prod-loading-overlay.active {
          opacity: 1 !important;
        }
        .free-prod-spinner-container {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 1.5rem !important;
          padding: 2.5rem !important;
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          border-radius: 1.5rem !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        .free-prod-spinner {
          width: 50px !important;
          height: 50px !important;
          border: 4px solid rgba(0, 0, 0, 0.06) !important;
          border-top-color: #0f172a !important;
          border-radius: 50% !important;
          animation: free-prod-spin 1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite !important;
          box-shadow: 0 0 15px rgba(15, 23, 42, 0.05) !important;
        }
        .free-prod-loading-text {
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.025em !important;
          color: #0f172a !important;
        }
        @keyframes free-prod-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styles);
    }

    const overlay = document.createElement('div');
    overlay.id = 'free-prod-loading-overlay';
    overlay.innerHTML = `
      <div class="free-prod-spinner-container">
        <div class="free-prod-spinner"></div>
        <div class="free-prod-loading-text">Updating your cart...</div>
      </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.classList.add('active');
    }, 10);
  }

  function hideLoader() {
    const overlay = document.getElementById('free-prod-loading-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 300);
  }

  function disableQtyButtonsInContainer(container) {
    if (!container) return;
    // 1. Target standard quantity wrappers inside the container
    const wrappers = container.querySelectorAll('quantity-input, .quantity, .qty, .js-qty, .quantity-selector, [data-quantity]');
    if (wrappers.length > 0) {
      wrappers.forEach(qtyWrapper => {
        const buttons = qtyWrapper.querySelectorAll('button, a');
        buttons.forEach(btn => {
          if (!btn.classList.contains('button--remove') && !btn.classList.contains('remove') && !btn.getAttribute('aria-label')?.toLowerCase().includes('remove')) {
            btn.disabled = true;
            btn.style.setProperty('pointer-events', 'none', 'important');
            btn.style.setProperty('opacity', '0.4', 'important');
          }
        });
      });
    } else {
      // 2. Fallback: Find buttons that adjust quantity directly in the container
      const buttons = container.querySelectorAll('button, a');
      buttons.forEach(btn => {
        const text = (btn.textContent || '').trim();
        const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
        const cls = (btn.className || '').toLowerCase();
        const name = (btn.name || '').toLowerCase();
        
        if (text === '+' || text === '-' || 
            aria.includes('increase') || aria.includes('decrease') || 
            cls.includes('plus') || cls.includes('minus') || 
            cls.includes('qty') || cls.includes('quantity') ||
            name.includes('plus') || name.includes('minus')) {
          if (!btn.classList.contains('button--remove') && !aria.includes('remove') && text !== 'remove' && !name.includes('remove')) {
            if (btn.tagName === 'BUTTON') {
              btn.disabled = true;
            }
            btn.style.setProperty('pointer-events', 'none', 'important');
            btn.style.setProperty('opacity', '0.4', 'important');
          }
        }
      });
    }
  }

  function applyQtyRestrictions(cart) {
    if (!cart || !cart.items) return;
    
    // Find indices (1-based) and variant IDs of items that are free gifts
    const freeGiftIndices = [];
    const freeGiftVariantIds = [];
    const variantCounts = {};
    
    cart.items.forEach((item, idx) => {
      const vid = String(item.variant_id);
      variantCounts[vid] = (variantCounts[vid] || 0) + 1;
      
      const isFreeGift = item.properties && (item.properties.free_gift_code || item.properties._free_gift_code);
      if (isFreeGift) {
        freeGiftIndices.push(idx + 1); // 1-based index
        freeGiftVariantIds.push(vid);
      }
    });

    if (freeGiftIndices.length === 0) return;
    
    // 1. Target by Dawn/Standard patterns (data-index or ID containing line number)
    freeGiftIndices.forEach(index => {
      const selectors = [
        `input[id="Quantity-${index}"]`,
        `input[data-index="${index}"]`,
        `[data-cart-item-index="${index}"] input`,
        `#CartItem-${index} input`,
        `#CartDrawer-Item-${index} input`
      ];
      
      let foundInput = false;
      selectors.forEach(sel => {
        const input = document.querySelector(sel);
        if (input) {
          disableQtyInputAndButtons(input);
          foundInput = true;
        }
      });

      if (!foundInput) {
        // Find container and disable buttons directly
        const containers = [
          `[data-cart-item-index="${index}"]`,
          `#CartItem-${index}`,
          `#CartDrawer-Item-${index}`
        ];
        containers.forEach(sel => {
          const container = document.querySelector(sel);
          if (container) {
            disableQtyButtonsInContainer(container);
          }
        });
      }
    });

    // 2. Target by Variant ID in attributes or URLs
    freeGiftVariantIds.forEach(vid => {
      // If the variant is not unique in the cart (e.g. we have both the regular product and the free gift),
      // we must target by key to avoid disabling the regular product's quantity input.
      if (variantCounts[vid] > 1) {
        const matchingFreeGifts = cart.items.filter(item => 
          String(item.variant_id) === vid && 
          item.properties && 
          (item.properties.free_gift_code || item.properties._free_gift_code)
        );
        
        matchingFreeGifts.forEach(item => {
          const key = String(item.key);
          const elements = Array.from(document.querySelectorAll(`[href*="${key}"], [data-cart-item-key="${key}"], [data-key="${key}"], [id*="${key}"], [name*="${key}"]`));
          elements.forEach(el => {
            const itemContainer = el.closest('.cart-item, .cart__item, [data-cart-item], tr, .cart-row, .cart-line-item');
            if (itemContainer) {
              const inputs = itemContainer.querySelectorAll('input[type="number"], input.quantity__input, .quantity input');
              if (inputs.length > 0) {
                inputs.forEach(input => {
                  disableQtyInputAndButtons(input);
                });
              } else {
                disableQtyButtonsInContainer(itemContainer);
              }
            }
          });
        });
      } else {
        const elements = Array.from(document.querySelectorAll(`[href*="${vid}"], [data-variant-id="${vid}"], [id*="${vid}"], [class*="${vid}"]`));
        elements.forEach(el => {
          const itemContainer = el.closest('.cart-item, .cart__item, [data-cart-item], tr, .cart-row, .cart-line-item');
          if (itemContainer) {
            const inputs = itemContainer.querySelectorAll('input[type="number"], input.quantity__input, .quantity input');
            if (inputs.length > 0) {
              inputs.forEach(input => {
                disableQtyInputAndButtons(input);
              });
            } else {
              disableQtyButtonsInContainer(itemContainer);
            }
          }
        });
      }
    });

    // 3. Fallback: Search text nodes containing "free_gift_code"
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walk.nextNode()) {
      if (node.nodeValue.includes('free_gift_code') || node.nodeValue.includes('_free_gift_code')) {
        const itemContainer = node.parentElement.closest('.cart-item, .cart__item, [data-cart-item], tr, .cart-row, .cart-line-item, cart-drawer-items > div');
        if (itemContainer) {
          const inputs = itemContainer.querySelectorAll('input[type="number"], input.quantity__input, .quantity input');
          if (inputs.length > 0) {
            inputs.forEach(input => {
              disableQtyInputAndButtons(input);
            });
          } else {
            disableQtyButtonsInContainer(itemContainer);
          }
        }
      }
    }
  }

  function disableQtyInputAndButtons(input) {
    if (!input) return;
    
    // Disable the input itself
    input.readOnly = true;
    input.disabled = true;
    input.style.setProperty('pointer-events', 'none', 'important');
    input.style.setProperty('opacity', '0.6', 'important');
    
    // 1. Disable inside standard wrappers
    const qtyWrapper = input.closest('quantity-input, .quantity, .qty, .js-qty, .quantity-selector, [data-quantity]');
    if (qtyWrapper) {
      const buttons = qtyWrapper.querySelectorAll('button, a');
      buttons.forEach(btn => {
        if (!btn.classList.contains('button--remove') && !btn.getAttribute('aria-label')?.toLowerCase().includes('remove')) {
          btn.disabled = true;
          btn.style.setProperty('pointer-events', 'none', 'important');
          btn.style.setProperty('opacity', '0.4', 'important');
        }
      });
    }
    
    // 2. Disable sibling buttons/controls if no standard wrapper, or in addition to wrapper
    if (input.parentNode) {
      const siblings = Array.from(input.parentNode.children);
      siblings.forEach(sibling => {
        if (sibling !== input) {
          const isButton = sibling.tagName === 'BUTTON' || sibling.tagName === 'A';
          const name = (sibling.name || '').toLowerCase();
          const cls = (sibling.className || '').toLowerCase();
          const text = (sibling.textContent || '').trim().toLowerCase();
          const aria = (sibling.getAttribute('aria-label') || '').toLowerCase();
          
          if (isButton || name.includes('plus') || name.includes('minus') || 
              cls.includes('plus') || cls.includes('minus') || 
              cls.includes('qty') || cls.includes('quantity') ||
              text === '+' || text === '-' || 
              aria.includes('increase') || aria.includes('decrease')) {
            if (!sibling.classList.contains('button--remove') && !aria.includes('remove') && text !== 'remove' && !name.includes('remove')) {
              if (sibling.tagName === 'BUTTON') {
                sibling.disabled = true;
              }
              sibling.style.setProperty('pointer-events', 'none', 'important');
              sibling.style.setProperty('opacity', '0.4', 'important');
            }
          }
        }
      });
    }
  }

  async function refreshCart(cart) {
    console.log("[FreeProductAdder] Refreshing cart UI...");
    const cartDrawer = document.querySelector('cart-drawer');
    const cartNotification = document.querySelector('cart-notification');

    let sections = [];
    if (cartDrawer && typeof cartDrawer.getSectionsToRender === 'function') {
      sections = sections.concat(cartDrawer.getSectionsToRender().map(s => s.section || s.id));
    }
    if (cartNotification && typeof cartNotification.getSectionsToRender === 'function') {
      sections = sections.concat(cartNotification.getSectionsToRender().map(s => s.section || s.id));
    }
    sections = [...new Set(sections)].filter(Boolean);

    let parsedState = cart || { items: [] };
    if (sections.length > 0 && (!parsedState || !parsedState.sections)) {
      try {
        const sectionQuery = sections.join(',');
        console.log("[FreeProductAdder] Fetching rendered sections for cart UI...", sectionQuery);
        const res = await fetch(`/cart?source=free-product-adder&sections=${encodeURIComponent(sectionQuery)}`);
        if (res.ok) {
          const sectionsHtml = await res.json();
          parsedState = {
            ...parsedState,
            sections: sectionsHtml
          };
        }
      } catch (err) {
        console.error("[FreeProductAdder] Error fetching sections:", err);
      }
    }

    console.log("[FreeProductAdder] Dispatching cart refresh events...");
    const events = ['cart:refresh', 'cart:update', 'ajaxProduct:added', 'ajaxCart:refresh'];
    events.forEach(eventName => {
      document.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true,
        detail: {
          ...parsedState,
          cart: parsedState
        }
      }));
    });
    lastCart = parsedState;
    applyQtyRestrictions(parsedState);

    if (parsedState && parsedState.sections) {
      if (cartDrawer && typeof cartDrawer.renderContents === 'function') {
        cartDrawer.renderContents(parsedState);
        applyQtyRestrictions(parsedState);
      }
      if (cartNotification && typeof cartNotification.renderContents === 'function') {
        cartNotification.renderContents(parsedState);
        applyQtyRestrictions(parsedState);
      }
    } else {
      console.warn("[FreeProductAdder] No sections returned in cart state, forcing window reload as fallback.");
      window.location.reload();
    }
  }

  function isClearCode(code) {
    if (!code) return true;
    const upper = code.trim().toUpperCase();
    return upper === "CLEAR" || upper === "CLEARED" || upper === "0" || upper === "NONE";
  }

  function getAppliedDiscountCodes(cart) {
    const codes = [];

    // 1. Check pending discount
    if (window.__pendingDiscount && !isClearCode(window.__pendingDiscount)) {
      codes.push(window.__pendingDiscount);
    }

    // 2. Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlCode = urlParams.get('discount') || urlParams.get('discount_code');
    if (urlCode && !isClearCode(urlCode)) {
      codes.push(urlCode.trim().toUpperCase());
    }

    // 3. Check Cookie
    const cookieMatch = document.cookie.match(/(^|;)\s*(discount|discount_code)\s*=\s*([^;]+)/);
    if (cookieMatch) {
      const cookieVal = decodeURIComponent(cookieMatch[3]).trim().toUpperCase();
      if (!isClearCode(cookieVal)) {
        codes.push(cookieVal);
      }
    }

    // 4. Check Cart applications
    if (cart && cart.discount_applications) {
      cart.discount_applications.forEach(a => {
        if (a.code && !isClearCode(a.code)) {
          codes.push(a.code.trim().toUpperCase());
        }
      });
    }

    // 5. Check Cart discount_codes (Shopify Ajax API field)
    if (cart && cart.discount_codes) {
      cart.discount_codes.forEach(c => {
        const codeVal = typeof c === 'string' ? c : (c.code || '');
        if (codeVal && !isClearCode(codeVal)) {
          codes.push(codeVal.trim().toUpperCase());
        }
      });
    }

    const uniqueCodes = [...new Set(codes)].filter(Boolean);
    console.log("[FreeProductAdder] Detected discount codes in session/cart:", uniqueCodes);
    return uniqueCodes;
  }

  async function addToCartWithRetry(items, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch('/cart/add.js?source=free-product-adder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });
        if (res.ok) {
          return res;
        }
        console.warn(`[FreeProductAdder] Attempt ${attempt} to add to cart failed with status: ${res.status}`);
      } catch (err) {
        console.warn(`[FreeProductAdder] Attempt ${attempt} to add to cart threw error:`, err);
      }
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    throw new Error(`Failed to add items to cart after ${maxRetries} attempts`);
  }

  async function check() {
    if (lock) {
      console.log("[FreeProductAdder] Check function is locked. Skipping execution.");
      return;
    }
    lock = true;
    try {
      console.log("[FreeProductAdder] Checking cart state...");
      const cartRes = await fetch('/cart.js?source=free-product-adder');
      if (!cartRes.ok) {
        console.error("[FreeProductAdder] Failed to fetch /cart.js:", cartRes.status);
        return;
      }
      const cart = await cartRes.json();

      // Skip redundant checks if the cart items and discount codes are unchanged
      if (lastCart) {
        const lastItemsStr = JSON.stringify((lastCart.items || []).map(i => ({ key: i.key, quantity: i.quantity, properties: i.properties })));
        const newItemsStr = JSON.stringify((cart.items || []).map(i => ({ key: i.key, quantity: i.quantity, properties: i.properties })));
        if (lastItemsStr === newItemsStr) {
          const oldCodes = getAppliedDiscountCodes(lastCart);
          const newCodes = getAppliedDiscountCodes(cart);
          if (JSON.stringify(oldCodes) === JSON.stringify(newCodes)) {
            console.log("[FreeProductAdder] Cart items and discount codes are unchanged. Skipping API calls.");
            lastCart = cart;
            applyQtyRestrictions(cart);
            return;
          }
        }
      }

      lastCart = cart;
      applyQtyRestrictions(cart);

      const codes = getAppliedDiscountCodes(cart);

      // Save active discount code or detect removal/change
      const previousCode = window.localStorage.getItem('active_discount_code');
      if (codes.length > 0) {
        const currentCode = codes[0];
        if (previousCode && previousCode !== currentCode) {
          console.log(`[FreeProductAdder] Discount changed from ${previousCode} to ${currentCode}. Cleaning up old discount key.`);
          window.localStorage.removeItem(`free_products_added_${previousCode}`);
          window.localStorage.removeItem(`user_removed_free_gift_${previousCode}`);
        }
        window.localStorage.setItem('active_discount_code', currentCode);
      } else {
        if (previousCode) {
          const hasDiscountCookie = document.cookie.includes('discount') || document.cookie.includes('discount_code');
          if (!hasDiscountCookie && !window.__pendingDiscount) {
            console.log("[FreeProductAdder] Discount explicitly removed. Previous code was:", previousCode);
            window.localStorage.removeItem('active_discount_code');
            window.localStorage.removeItem(`free_products_added_${previousCode}`);
            window.localStorage.removeItem(`user_removed_free_gift_${previousCode}`);

            // Find if there are any free gifts with property 'free_gift_code' or '_free_gift_code' === previousCode
            const updates = {};
            let needsUpdate = false;
            cart.items.forEach(i => {
              const itemCode = i.properties && (i.properties.free_gift_code || i.properties._free_gift_code);
              if (itemCode && itemCode.toString().toUpperCase() === previousCode.toUpperCase()) {
                updates[i.key] = 0;
                needsUpdate = true;
              }
            });

          // Fallback to fetch mapping if no items had properties (maybe legacy cart session)
          if (!needsUpdate) {
            const apiUrl = `${APP}/api/discount-mapping?shop=${SHOP}&code=${encodeURIComponent(previousCode)}`;
            console.log("[FreeProductAdder] Fetching mapping for removed discount:", apiUrl);
            const res = await fetch(apiUrl);
            if (res.ok) {
              const { specialProducts: sps } = await res.json();
              if (sps && sps.length > 0) {
                const targetVids = [];
                sps.forEach(sp => {
                  if (sp.variants && sp.variants.length) {
                    sp.variants.forEach(v => {
                      targetVids.push(String(v.id.split('/').pop()));
                    });
                  } else {
                    const pid = String(sp.productId.split('/').pop());
                    cart.items.forEach(i => {
                      if (String(i.product_id) === pid) {
                        targetVids.push(String(i.variant_id));
                      }
                    });
                  }
                });
                cart.items.forEach(i => {
                  if (targetVids.includes(String(i.variant_id))) {
                    const sp = sps.find(s => {
                      if (s.variants && s.variants.length) {
                        return s.variants.map(v => String(v.id.split('/').pop())).includes(String(i.variant_id));
                      }
                      return String(s.productId.split('/').pop()) === String(i.product_id);
                    });
                    const target = sp ? (sp.quantity || 1) : 1;
                    const newQty = Math.max(0, i.quantity - target);
                    updates[i.key || i.variant_id] = newQty;
                    needsUpdate = true;
                  }
                });
              }
            }
          }

          if (needsUpdate) {
            console.log("[FreeProductAdder] Removing special products from cart:", updates);
            showLoader();
            const updateRes = await fetch('/cart/update.js?source=free-product-adder', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ updates })
            });
            if (updateRes.ok) {
              console.log("[FreeProductAdder] Successfully removed items.");
              const newCart = await updateRes.json();
              await refreshCart(newCart);
              return;
            } else {
              console.error("[FreeProductAdder] Failed to remove items via /cart/update.js:", updateRes.status);
              hideLoader();
            }
          }
        }
      }
    }

      if (!codes.length) {
        console.log("[FreeProductAdder] No discount codes found. No action needed.");
        return;
      }

      let changed = false;
      const toAdd = [];

      for (const code of codes) {
        if (window.localStorage.getItem(`user_removed_free_gift_${code}`) === 'true') {
          console.log(`[FreeProductAdder] Free product for code ${code} was manually removed by user. Skipping auto-addition.`);
          continue;
        }
        console.log("[FreeProductAdder] Cart items properties check:", cart.items.map(i => i.properties));
        const hasFreeGiftInCart = cart.items.some(i => {
          if (!i.properties) return false;
          const val = i.properties.free_gift_code || i.properties._free_gift_code;
          return val && val.toString().toUpperCase() === code.toUpperCase();
        });
        if (hasFreeGiftInCart) {
          console.log(`[FreeProductAdder] Free product for code ${code} is already in the cart. Skipping API mapping fetch.`);
          window.localStorage.setItem(`free_products_added_${code}`, 'true');
          continue;
        }
        window.localStorage.removeItem(`free_products_added_${code}`);
        const apiUrl = `${APP}/api/discount-mapping?shop=${SHOP}&code=${encodeURIComponent(code)}`;
        console.log("[FreeProductAdder] Fetching discount mapping from:", apiUrl);
        const res = await fetch(apiUrl);
        if (!res.ok) {
          console.error("[FreeProductAdder] Failed to fetch mapping for code:", code, res.status);
          continue;
        }
        const { specialProducts: sps } = await res.json();
        console.log("[FreeProductAdder] Mapped free products for", code, ":", sps);
        if (!sps || sps.length === 0) continue;

        let allSpsInCart = true;
        const toAddForThisCode = [];

        for (const sp of sps) {
          let freeInCart = 0;
          let vid = '';
          const target = sp.quantity || 1;

          if (sp.variants && sp.variants.length) {
            const vids = sp.variants.map(v => v.id.split('/').pop());
            cart.items.forEach(i => {
              if (vids.includes(String(i.variant_id))) {
                if (i.properties && i.properties.free_gift_code === code) {
                  freeInCart += i.quantity;
                }
              }
            });
            vid = vids[0];
          } else {
            const pid = sp.productId.split('/').pop();
            cart.items.forEach(i => {
              if (String(i.product_id) === String(pid)) {
                if (i.properties && i.properties.free_gift_code === code) {
                  freeInCart += i.quantity;
                }
              }
            });
            if (sp.variants && sp.variants.length) {
              vid = sp.variants[0].id.split('/').pop();
            }
          }

          if (vid) {
            if (freeInCart < target) {
              allSpsInCart = false;
              toAddForThisCode.push({
                id: parseInt(vid, 10),
                quantity: target,
                properties: {
                  "free_gift_code": code
                }
              });
            }
          }
        }

        if (allSpsInCart) {
          console.log(`[FreeProductAdder] Free products for ${code} already in cart at target quantities. Marking as processed.`);
          window.localStorage.setItem(`free_products_added_${code}`, 'true');
        } else if (toAddForThisCode.length > 0) {
          toAdd.push(...toAddForThisCode);
          changed = true;
        }
      }

      if (changed && toAdd.length) {
        console.log("[FreeProductAdder] Executing post to /cart/add.js with items:", toAdd);
        showLoader();
        try {
          const addRes = await addToCartWithRetry(toAdd);
          console.log("[FreeProductAdder] Successfully added items.");
          codes.forEach(code => {
            window.localStorage.setItem(`free_products_added_${code}`, 'true');
          });
          const newCartRes = await fetch('/cart.js?source=free-product-adder');
          if (newCartRes.ok) {
            const newCart = await newCartRes.json();
            await refreshCart(newCart);
          } else {
            hideLoader();
          }
        } catch (err) {
          console.error("[FreeProductAdder] Failed to add items via /cart/add.js after retries:", err);
          hideLoader();
        }
      } else {
        console.log("[FreeProductAdder] All mapped products already in cart at target quantities.");
        codes.forEach(code => {
          window.localStorage.setItem(`free_products_added_${code}`, 'true');
        });
      }
    } catch (e) {
      console.error("[FreeProductAdder] Exception during check:", e);
    } finally {
      lock = false;
      hideLoader();
    }
  }

  // Intercept form submissions containing a discount code
  window.addEventListener('submit', async function (e) {
    const input = e.target.querySelector('input[name="discount"]');
    if (!input || !input.value.trim()) return;
    const code = input.value.trim().toUpperCase();
    console.log("[FreeProductAdder] Intercepted discount form submit for code:", code);

    if (isClearCode(code)) {
      console.log("[FreeProductAdder] Intercepted discount clear via form submit");
      window.__pendingDiscount = null;
      document.cookie = "discount=; Max-Age=0; path=/;";
      document.cookie = "discount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return; // let form submit clear the discount naturally
    }

    e.preventDefault();
    try {
      window.localStorage.removeItem(`user_removed_free_gift_${code}`);
      const res = await fetch(`${APP}/api/discount-mapping?shop=${SHOP}&code=${encodeURIComponent(code)}`);
      if (res.ok) {
        const { specialProducts: sps } = await res.json();
        if (sps && sps.length) {
          const cartRes = await fetch('/cart.js?source=free-product-adder');
          const cart = cartRes.ok ? await cartRes.json() : { items: [] };
          const toAdd = [];
          for (const sp of sps) {
            let freeInCart = 0;
            const vids = (sp.variants || []).map(v => v.id.split('/').pop());
            if (vids.length) {
              cart.items.forEach(i => {
                if (vids.includes(String(i.variant_id))) {
                  if (i.properties && i.properties.free_gift_code === code) {
                    freeInCart += i.quantity;
                  }
                }
              });
              const target = sp.quantity || 1;
              if (freeInCart < target) {
                toAdd.push({
                  id: parseInt(vids[0], 10),
                  quantity: target,
                  properties: {
                    "free_gift_code": code
                  }
                });
              }
            }
          }
          if (toAdd.length) {
            console.log("[FreeProductAdder] Form submit adding items:", toAdd);
            try {
              const addRes = await addToCartWithRetry(toAdd);
              window.localStorage.setItem(`free_products_added_${code}`, 'true');
            } catch (err) {
              console.error("[FreeProductAdder] Form submit failed to add items after retries:", err);
            }
          } else {
            window.localStorage.setItem(`free_products_added_${code}`, 'true');
          }
        }
      }
    } catch (err) {
      console.error("[FreeProductAdder] Error in intercepting form submission:", err);
    }
    console.log("[FreeProductAdder] Resubmitting form normally...");
    e.target.submit();
  });

  function findDiscountTargets() {
    const targets = [];
    console.log("[FreeProductAdder] Scanning DOM for discount targets...");

    // 1. Exact match for disclosure button
    const disclosureBtn = document.querySelector('button[aria-controls="cart-discount-disclosure"]');
    if (disclosureBtn) {
      console.log("[FreeProductAdder] Found disclosure button:", disclosureBtn);
      targets.push(disclosureBtn);
      return targets;
    }

    // Find all buttons
    const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a.button, a.btn'));
    buttons.forEach(el => {
      const id = (el.id || '').toLowerCase();
      const cls = (el.className || '').toLowerCase();
      const text = (el.textContent || el.value || '').trim().toLowerCase();
      const name = (el.name || '').toLowerCase();

      if (id.includes('discount') || cls.includes('discount') || name.includes('discount') ||
        id.includes('coupon') || cls.includes('coupon') || name.includes('coupon') ||
        text.includes('apply') || text.includes('redeem')) {
        targets.push(el);
      }
    });

    // Grab any inputs with name/id/class/placeholder containing discount/coupon
    const inputs = Array.from(document.querySelectorAll('input, textarea'));
    inputs.forEach(el => {
      const id = (el.id || '').toLowerCase();
      const cls = (el.className || '').toLowerCase();
      const name = (el.name || '').toLowerCase();
      const placeholder = (el.placeholder || '').toLowerCase();

      if (name === 'discount' || id.includes('discount') || cls.includes('discount') ||
        name.includes('coupon') || id.includes('coupon') || cls.includes('coupon') ||
        placeholder.includes('discount') || placeholder.includes('coupon') || placeholder.includes('promo')) {
        targets.push(el);
      }
    });

    console.log("[FreeProductAdder] Found targets:", targets);
    return [...new Set(targets)];
  }

  function injectDiscountText() {
    try {
      const targets = findDiscountTargets();
      if (targets.length === 0) {
        console.log("[FreeProductAdder] No discount targets found in DOM.");
        return;
      }
      targets.forEach(target => {
        let targetInsert = target;

        const isDisclosure = target.getAttribute('aria-controls') === 'cart-discount-disclosure';
        if (!isDisclosure) {
          const parent = targetInsert.parentElement;
          if (parent && parent.tagName !== 'FORM' && parent.tagName !== 'BODY') {
            try {
              const style = window.getComputedStyle(parent);
              if (style && (style.display === 'flex' || style.display === 'inline-flex' || parent.classList.contains('field') || parent.className.includes('row') || parent.className.includes('wrapper') || parent.className.includes('container'))) {
                targetInsert = parent;
              }
            } catch (e) {
              console.error("[FreeProductAdder] Error getting parent style:", e);
            }
          }
        }

        let sibling = targetInsert.nextElementSibling;
        let alreadyInjected = false;
        while (sibling) {
          if (sibling.classList.contains('free-gift-discount-info')) {
            alreadyInjected = true;
            break;
          }
          sibling = sibling.nextElementSibling;
        }
        if (alreadyInjected) {
          console.log("[FreeProductAdder] Info text already exists near target:", targetInsert);
          return;
        }

        if (targetInsert.parentNode) {
          const info = document.createElement('div');
          info.className = 'free-gift-discount-info';
          info.textContent = 'Apply your coupon code here to unlock eligible free products.';
          info.style.fontSize = '12px';
          info.style.color = '#4b5563';
          info.style.margin = '8px 0';
          info.style.fontWeight = '500';
          info.style.width = '100%';
          targetInsert.parentNode.insertBefore(info, targetInsert.nextSibling);
          console.log("[FreeProductAdder] Successfully injected info text below target:", targetInsert);
        }
      });
    } catch (err) {
      console.error("[FreeProductAdder] Error in injectDiscountText:", err);
    }
  }

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    check();
    injectDiscountText();
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      check();
      injectDiscountText();
    });
  }

  // Set up MutationObserver to handle dynamic cart rendering/drawers
  const observer = new MutationObserver((mutations) => {
    observer.disconnect();
    try {
      injectDiscountText();
      if (lastCart) {
        applyQtyRestrictions(lastCart);
      }
    } catch (e) {
      console.error("[FreeProductAdder] Observer error:", e);
    } finally {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  const origFetch = window.fetch;
  window.fetch = function (...args) {
    const url = args[0];
    if (typeof url === 'string') {
      if (url.includes('/discount/')) {
        const parts = url.split('/discount/');
        const code = parts[parts.length - 1].split('?')[0].trim().toUpperCase();
        showLoader();
        if (isClearCode(code)) {
          console.log("[FreeProductAdder] Intercepted fetch to /discount/ (clear)");
          window.__pendingDiscount = null;
          document.cookie = "discount=; Max-Age=0; path=/;";
          document.cookie = "discount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } else {
          console.log("[FreeProductAdder] Intercepted fetch to /discount/ with code:", code);
          window.__pendingDiscount = code;
          window.localStorage.removeItem(`user_removed_free_gift_${code}`);
        }
      } else if (url.includes('discount=')) {
        const match = url.match(/[?&]discount=([^&]+)/);
        if (match) {
          const code = decodeURIComponent(match[1]).trim().toUpperCase();
          showLoader();
          if (isClearCode(code)) {
            console.log("[FreeProductAdder] Intercepted fetch containing discount clear parameter");
            window.__pendingDiscount = null;
            document.cookie = "discount=; Max-Age=0; path=/;";
            document.cookie = "discount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          } else {
            console.log("[FreeProductAdder] Intercepted fetch containing discount parameter:", code);
            window.__pendingDiscount = code;
            window.localStorage.removeItem(`user_removed_free_gift_${code}`);
          }
        }
      }
    }
    return origFetch.apply(this, args).then(res => {
      if (typeof url === 'string' && (url.includes('/cart') || url.includes('/discount'))) {
        if (url.includes('source=free-product-adder')) {
          return res;
        }
        console.log("[FreeProductAdder] Intercepted cart/discount fetch completion. Scheduling check.");
        setTimeout(check, 500);
      }
      return res;
    });
  };

  const origXhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('load', function () {
      const url = this._url || '';
      if (url.includes('/cart') || url.includes('/discount')) {
        console.log("[FreeProductAdder] Intercepted XHR cart/discount completion. Scheduling check.");
        setTimeout(check, 500);
      }
    });
    return origXhrSend.apply(this, args);
  };

  const origXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this._url = url;
    if (typeof url === 'string') {
      if (url.includes('/discount/')) {
        const parts = url.split('/discount/');
        const code = parts[parts.length - 1].split('?')[0].trim().toUpperCase();
        showLoader();
        if (isClearCode(code)) {
          console.log("[FreeProductAdder] Intercepted XHR open discount clear");
          window.__pendingDiscount = null;
          document.cookie = "discount=; Max-Age=0; path=/;";
          document.cookie = "discount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } else {
          console.log("[FreeProductAdder] Intercepted XHR open /discount/ with code:", code);
          window.__pendingDiscount = code;
          window.localStorage.removeItem(`user_removed_free_gift_${code}`);
        }
      } else if (url.includes('discount=')) {
        const match = url.match(/[?&]discount=([^&]+)/);
        if (match) {
          const code = decodeURIComponent(match[1]).trim().toUpperCase();
          showLoader();
          if (isClearCode(code)) {
            console.log("[FreeProductAdder] Intercepted XHR open containing discount clear parameter");
            window.__pendingDiscount = null;
            document.cookie = "discount=; Max-Age=0; path=/;";
            document.cookie = "discount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          } else {
            console.log("[FreeProductAdder] Intercepted XHR open containing discount parameter:", code);
            window.__pendingDiscount = code;
            window.localStorage.removeItem(`user_removed_free_gift_${code}`);
          }
        }
      }
    }
    return origXhrOpen.apply(this, [method, url].concat(args));
  };

  // Listen for clicks on remove buttons
  window.addEventListener('click', function(e) {
    const removeBtn = e.target.closest('.button--remove, a[href*="change"], [class*="remove" i], [id*="remove" i]');
    if (!removeBtn) return;
    
    const itemContainer = removeBtn.closest('.cart-item, .cart__item, [data-cart-item], tr, .cart-row, .cart-line-item');
    if (!itemContainer) return;
    
    const html = itemContainer.innerHTML;
    const match = html.match(/free_gift_code["'\s:]+([^"'\s<]+)/i) || html.match(/_free_gift_code["'\s:]+([^"'\s<]+)/i);
    if (match) {
      const code = match[1].trim().toUpperCase();
      console.log("[FreeProductAdder] User clicked remove for free gift code:", code);
      window.localStorage.setItem(`user_removed_free_gift_${code}`, 'true');
    } else if (lastCart && lastCart.items) {
      const variantIdMatch = html.match(/variant_id["'\s:]+(\d+)/i) || html.match(/\/products\/[^?]+[?&]variant=(\d+)/i) || html.match(/change\?id=(\d+)/i);
      if (variantIdMatch) {
        const vid = variantIdMatch[1];
        const item = lastCart.items.find(i => String(i.variant_id) === String(vid) || String(i.id) === String(vid));
        if (item && item.properties) {
          const code = item.properties.free_gift_code || item.properties._free_gift_code;
          if (code) {
            console.log("[FreeProductAdder] User clicked remove for free gift (variant fallback) code:", code);
            window.localStorage.setItem(`user_removed_free_gift_${code}`, 'true');
          }
        }
      }
    }
  }, true);
})();
